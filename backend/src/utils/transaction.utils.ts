import { db } from "../db/index.js";

/**
 * Thực thi một hàm trong transaction của Drizzle ORM
 * Nếu kết nối cơ sở dữ liệu lỗi hoặc không hỗ trợ, sẽ gọi hàm fallback trực tiếp.
 */
export async function withTransaction<T>(
  action: (tx: any) => Promise<T>,
  fallbackAction?: () => Promise<T>
): Promise<T> {
  try {
    return await db.transaction(async (tx) => {
      return await action(tx);
    });
  } catch (error: any) {
    if (fallbackAction) {
      return await fallbackAction();
    }
    throw error;
  }
}

