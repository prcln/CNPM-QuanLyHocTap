import { RegisterForm } from "@/components/auth/register-form";
import type { AuthUser } from "@/types/auth";

type RegisterPageProps = {
  onRegisterSuccess: (user: AuthUser) => void;
  onSwitchToLogin: () => void;
};

export default function RegisterPage({
  onRegisterSuccess,
  onSwitchToLogin,
}: RegisterPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <RegisterForm onRegisterSuccess={onRegisterSuccess} />

      <p className="text-sm text-muted-foreground">
        Đã có tài khoản?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="underline underline-offset-4"
        >
          Đăng nhập
        </button>
      </p>
    </div>
  );
}