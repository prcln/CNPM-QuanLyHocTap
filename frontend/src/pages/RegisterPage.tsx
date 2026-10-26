import { RegisterForm } from "@/components/auth/register-form";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
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
    <AuthPageLayout
      footerText="Đã có tài khoản?"
      actionText="Đăng nhập"
      onAction={onSwitchToLogin}
    >
      <RegisterForm onRegisterSuccess={onRegisterSuccess} />
    </AuthPageLayout>
  );
}
