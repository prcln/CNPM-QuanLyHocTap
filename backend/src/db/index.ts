import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/cnpm_qlht";

export const client = postgres(connectionString, {
  prepare: false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 5,
});

export const db = drizzle(client, { schema });

export async function isDbConnected(): Promise<boolean> {
  try {
    const res = await client`SELECT 1 as ok`;
    return Boolean(res && res.length > 0);
  } catch {
    return false;
  }
}
