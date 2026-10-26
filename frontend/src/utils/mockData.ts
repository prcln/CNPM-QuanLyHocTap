import type { User } from "@/types/auth";

// Dữ liệu giả lập chỉ dùng cho môi trường phát triển.
export const mockUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    password: "123456",
  },
];