import { Button } from "@/components/ui/button";
import type { AccountRole, DemoAccount } from "../types";

type DemoCredentialsProps = {
  accounts: DemoAccount[];
  onUse: (account: DemoAccount) => void;
};

const ROLE_LABEL: Record<AccountRole, string> = {
  rider: "Rider",
  admin: "Admin (rental)",
};

// Demo accounts are shown on purpose: there is no real login yet, and no
// session is created (glossary: Internet Identity).
export function DemoCredentials({ accounts, onUse }: DemoCredentialsProps) {
  return (
    <section aria-labelledby="demo-logins-title" className="flex flex-col gap-3 rounded-md bg-info-soft p-3 text-ink">
      <h2 id="demo-logins-title" className="text-base font-semibold">
        Demo logins
      </h2>
      <ul className="flex flex-col gap-3">
        {accounts.map((account) => (
          <li key={account.email} className="flex flex-col gap-2 rounded-md bg-surface p-3">
            <p className="text-base font-semibold">{ROLE_LABEL[account.role]}</p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
              <dt className="text-ink-muted">Email</dt>
              <dd className="break-all font-mono">{account.email}</dd>
              <dt className="text-ink-muted">Password</dt>
              <dd className="break-all font-mono">{account.password}</dd>
            </dl>
            <Button
              variant="secondary"
              onClick={() => onUse(account)}
              aria-label={`Fill in the ${ROLE_LABEL[account.role].toLowerCase()} demo login`}
            >
              Use this login
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
