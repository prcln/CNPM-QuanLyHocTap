import { LoginForm } from "@/components/auth/login-form";
import type { AuthUser } from "@/types/auth";

type LoginPageProps = {
  onLoginSuccess: (user: AuthUser) => void;
  onSwitchToRegister: () => void;
};

export default function LoginPage({
  onLoginSuccess,
  onSwitchToRegister,
}: LoginPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <LoginForm onLoginSuccess={onLoginSuccess} />

      <p className="text-sm text-muted-foreground">
        Chưa có tài khoản?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="underline underline-offset-4"
        >
          Đăng ký ngay
        </button>
      </p>
    </div>
  );
}