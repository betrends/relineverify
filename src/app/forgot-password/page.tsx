import { ThemeProvider } from "@/components/ThemeProvider";
import SignupHero from "@/components/auth/SignupHero";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <ThemeProvider>
      <div className="grid min-h-screen bg-white text-slate-900 dark:bg-ink-950 dark:text-paper-100 lg:grid-cols-2">
        <div className="hidden lg:block">
          <SignupHero />
        </div>
        <ForgotPasswordForm />
      </div>
    </ThemeProvider>
  );
}
