import { ThemeProvider } from "@/components/ThemeProvider";
import SignupHero from "@/components/auth/SignupHero";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <ThemeProvider>
      <div className="grid min-h-screen bg-white text-slate-900 dark:bg-ink-950 dark:text-paper-100 lg:grid-cols-2">
        <div className="hidden lg:block">
          <SignupHero />
        </div>
        <SignupForm />
      </div>
    </ThemeProvider>
  );
}
