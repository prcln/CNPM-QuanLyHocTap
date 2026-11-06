import fs from "fs";
import path from "path";
import { client } from "./index.js";

export async function runMigrations() {
  try {
    console.log("=== Running ERD Database Migrations ===");
    // G2: Luôn dùng path.resolve(__dirname, ...) thay vì process.cwd()
    const sqlPath = path.resolve(__dirname, "./migrations/0000_erd_schema.sql");

    if (!fs.existsSync(sqlPath)) {
      throw new Error(`Migration SQL file not found at: ${sqlPath}`);
    }

    const sqlContent = fs.readFileSync(sqlPath, "utf-8");
    await client.unsafe(sqlContent);

    console.log("✅ All ERD tables have been migrated successfully!");
  } catch (error: any) {
    console.error("❌ Migration failed:", error.message || error);
    throw error;
  }
}

// Chạy trực tiếp qua CLI
if (require.main === module || process.argv[1]?.includes("migrate")) {
  runMigrations()
    .then(async () => {
      await client.end();
      process.exit(0);
    })
    .catch(async () => {
      await client.end();
      process.exit(1);
    });
}

