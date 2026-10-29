import Link from "next/link";
import { Logo } from "@/components/common/logo";
import { mockDemoAccount } from "./data/mock";
import { LoginForm } from "./components/login-form";
import { SignupForm } from "./components/signup-form";
import type { AuthMode } from "./types";

type AuthProps = {
  mode: AuthMode;
};

const COPY: Record<AuthMode, { title: string; subtitle: string; prompt: string; link: string; href: string }> = {
  login: {
    title: "Log in",
    subtitle: "Lease a battery and keep track of your charge.",
    prompt: "New to ChargeX?",
    link: "Create an account",
    href: "/signup",
  },
  signup: {
    title: "Create your account",
    subtitle: "It takes less than a minute.",
    prompt: "Already have an account?",
    link: "Log in",
    href: "/login",
  },
};

export default function Auth({ mode }: AuthProps) {
  const copy = COPY[mode];

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-linear-to-b from-primary-soft/70 via-canvas to-canvas px-4 py-8">
      <div className="flex w-full max-w-md flex-col gap-6">
        <header className="flex flex-col gap-1">
          <div className="mb-6">
            <Logo size="md" tagline />
          </div>
          <h1 className="text-2xl font-semibold text-ink">{copy.title}</h1>
          <p className="text-base text-ink-muted">{copy.subtitle}</p>
        </header>

        <section aria-label={copy.title} className="rounded-lg bg-surface p-4 shadow-card sm:p-6">
          {mode === "login" ? <LoginForm demoAccount={mockDemoAccount} /> : <SignupForm />}
        </section>

        <p className="text-center text-sm text-ink-muted">
          {copy.prompt}{" "}
          <Link
            href={copy.href}
            className="inline-flex min-h-11 items-center rounded-sm font-medium text-ink underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            {copy.link}
          </Link>
        </p>

        <p className="text-center text-xs text-ink-muted">
          Demo only. No real account or session is created, and nothing is saved.
        </p>
      </div>
    </main>
  );
}
