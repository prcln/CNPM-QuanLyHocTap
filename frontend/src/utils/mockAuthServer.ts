import type {
  LoginPayload,
  RegisterPayload,
  LoginResponse,
} from "@/types/auth";
import { AuthError } from "@/types/auth";
import { mockUsers } from "@/utils/mockData";

// Giả lập phản hồi từ POST /api/v1/auth/login
export async function mockLoginRequest(
  payload: LoginPayload
): Promise<LoginResponse> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const user = mockUsers.find(
    (item) => item.username === payload.username
  );

  if (!user || user.password !== payload.password) {
    throw new AuthError("Tên đăng nhập hoặc mật khẩu không đúng");
  }

  return {
    access_token: btoa(`${user.username}:${Date.now()}`),
    token_type: "Bearer",
    expires_in: 3600,
    account: {
      matk: Number(user.id),
      username: user.username,
      role: "SV" as const,
    },
  };
}


export async function mockRegisterRequest(
  payload: RegisterPayload
): Promise<LoginResponse> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const { username, email, password, confirmPassword } = payload;

  if (password !== confirmPassword) {
    throw new AuthError(
      "Mật khẩu xác nhận không khớp",
      "confirmPassword"
    );
  }

  if (mockUsers.some((user) => user.username === username)) {
    throw new AuthError(
      "Tên đăng nhập đã tồn tại",
      "username"
    );
  }

  const newUser = {
    id: String(
      Math.max(0, ...mockUsers.map((user) => Number(user.id))) + 1
    ),
    username,
    email,
    password,
  };

  mockUsers.push(newUser);

  return {
    access_token: btoa(`${newUser.username}:${Date.now()}`),
    token_type: "Bearer",
    expires_in: 3600,
    account: {
      matk: Number(newUser.id),
      username: newUser.username,
      role: "SV" as const,
    },
  };
}
