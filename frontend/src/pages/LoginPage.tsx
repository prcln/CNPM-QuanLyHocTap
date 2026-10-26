import { LoginForm } from "@/components/auth/login-form";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
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
    <AuthPageLayout
      footerText="Chưa có tài khoản?"
      actionText="Đăng ký ngay"
      onAction={onSwitchToRegister}
    >
      <LoginForm onLoginSuccess={onLoginSuccess} />
    </AuthPageLayout>
  );
}
