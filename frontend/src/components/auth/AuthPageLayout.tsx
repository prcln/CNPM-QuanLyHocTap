
import type { ReactNode } from "react";

interface AuthPageLayoutProps {
  children: ReactNode;
  footerText: string;
  actionText: string;
  onAction: () => void;
}

export function AuthPageLayout({
  children,
  footerText,
  actionText,
  onAction,
}: AuthPageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      {children}

      <p className="text-sm text-muted-foreground">
        {footerText}{" "}
        <button
          type="button"
          onClick={onAction}
          className="underline underline-offset-4"
        >
          {actionText}
        </button>
      </p>
    </div>
  );
}
