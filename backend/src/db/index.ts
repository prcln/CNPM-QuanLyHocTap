import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import dotenv from "dotenv";

dotenv.config();

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/cnpm_qlht";

export const client = postgres(connectionString, {
  prepare: false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 2,
});

const realDb = drizzle(client, { schema });

let dbOnline: boolean | null = null;
let lastCheckTime = 0;
const CHECK_INTERVAL_MS = 60000; // 60 seconds

export async function isDbConnected(): Promise<boolean> {
  const now = Date.now();
  if (dbOnline !== null && now - lastCheckTime < CHECK_INTERVAL_MS) {
    return dbOnline;
  }
  try {
    const res = await Promise.race([
      client`SELECT 1 as ok`,
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("DB Timeout")), 1200)),
    ]);
    dbOnline = Boolean(res && res.length > 0);
  } catch {
    dbOnline = false;
  }
  lastCheckTime = Date.now();
  return dbOnline;
}

export function isDbAvailable(): boolean {
  return dbOnline !== false;
}

export function recordDbFailure(): void {
  dbOnline = false;
  lastCheckTime = Date.now();
}

export function resetCircuitBreaker(): void {
  dbOnline = null;
  lastCheckTime = 0;
}

// Proxy circuit breaker for drizzle queries to ensure NFR-01 resilience
export const db = new Proxy(realDb, {
  get(target: any, prop: string | symbol, receiver: any) {
    if (dbOnline === false) {
      throw new Error("Database offline: Circuit breaker is open. Using in-memory store.");
    }

    const orig = Reflect.get(target, prop, receiver);
    if (typeof orig === "function") {
      return function (...args: any[]) {
        if (dbOnline === false) {
          throw new Error("Database offline: Circuit breaker is open. Using in-memory store.");
        }

        const queryObj = orig.apply(target, args);
        // Intercept promise chain if it's thenable
        if (queryObj && typeof queryObj.then === "function") {
          return queryObj.catch((err: any) => {
            recordDbFailure();
            throw err;
          });
        }
        return queryObj;
      };
    }
    return orig;
  },
}) as typeof realDb;
