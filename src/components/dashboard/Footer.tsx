import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 px-6 py-5 dark:border-ink-800">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 text-sm text-slate-500 sm:flex-row dark:text-slate-500">
        <p>© {new Date().getFullYear()} RELINEVERIFY. All rights reserved.</p>
        <div className="flex items-center gap-5">
          <Link href="/terms" className="hover:text-slate-900 dark:hover:text-paper-100">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-paper-100">
            Privacy
          </Link>
          <Link href="/contact" className="hover:text-slate-900 dark:hover:text-paper-100">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
