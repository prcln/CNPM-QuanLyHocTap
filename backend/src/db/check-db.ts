import { client } from "./index.js";
import bcrypt from "bcrypt";

async function setupTables() {
  try {
    console.log("Setting up tables on Supabase...");

    // 1. Tạo bảng tai_khoan nếu chưa có
    await client`
      CREATE TABLE IF NOT EXISTS tai_khoan (
        matk SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role CHAR(2) NOT NULL DEFAULT 'SV',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        deleted_at TIMESTAMP,
        deleted_by INTEGER
      );
    `;
    console.log("Table 'tai_khoan' is ready.");

    // 2. Tạo bảng refresh_tokens nếu chưa có
    await client`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id SERIAL PRIMARY KEY,
        matk INTEGER NOT NULL REFERENCES tai_khoan(matk) ON DELETE CASCADE,
        token_hash VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        revoked_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        user_agent VARCHAR(255),
        ip_address VARCHAR(45)
      );
    `;
    await client`CREATE INDEX IF NOT EXISTS idx_refresh_tokens_matk ON refresh_tokens(matk);`;
    await client`CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);`;
    console.log("Table 'refresh_tokens' is ready with indexes.");

    // 3. Seed tài khoản mẫu nếu chưa có
    const existing = await client`SELECT COUNT(*) FROM tai_khoan;`;
    if (parseInt(existing[0].count, 10) === 0) {
      console.log("Seeding initial accounts...");
      const saltRounds = 10;
      const adminHash = await bcrypt.hash("admin123", saltRounds);
      const userHash = await bcrypt.hash("123456", saltRounds);

      await client`
        INSERT INTO tai_khoan (username, password, role) VALUES
          ('admin', ${adminHash}, 'AD'),
          ('gv_huong', ${userHash}, 'GV'),
          ('sv_20210001', ${userHash}, 'SV')
        ON CONFLICT (username) DO NOTHING;
      `;
      console.log("Seed accounts created: admin/admin123, gv_huong/123456, sv_20210001/123456");
    } else {
      console.log(`tai_khoan already has ${existing[0].count} records.`);
    }

    const currentAccounts = await client`SELECT matk, username, role, created_at FROM tai_khoan;`;
    console.log("Accounts in database:", currentAccounts);

    await client.end();
    console.log("Database setup completed successfully!");
  } catch (err) {
    console.error("Setup error:", err);
    process.exit(1);
  }
}

setupTables();
