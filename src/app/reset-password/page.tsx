import SignupHero from "@/components/auth/SignupHero";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="grid min-h-screen bg-white text-slate-900 dark:bg-ink-950 dark:text-paper-100 lg:grid-cols-2">
      <div className="hidden lg:block">
        <SignupHero />
      </div>
      <ResetPasswordForm />
    </div>
  );
}
