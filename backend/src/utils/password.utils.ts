import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Băm mật khẩu sử dụng bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Đối soát mật khẩu thô với chuỗi băm
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
