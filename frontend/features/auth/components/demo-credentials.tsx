import { Button } from "@/components/ui/button";
import type { DemoAccount } from "../types";

type DemoCredentialsProps = {
  account: DemoAccount;
  onUse: () => void;
};

export function DemoCredentials({ account, onUse }: DemoCredentialsProps) {
  return (
    <div className="flex flex-col gap-3 rounded-md bg-info-soft p-3 text-sm text-ink">
      <p className="font-medium">Demo login</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        <dt className="text-ink-muted">Email</dt>
        <dd className="break-all font-mono">{account.email}</dd>
        <dt className="text-ink-muted">Password</dt>
        <dd className="break-all font-mono">{account.password}</dd>
      </dl>
      <Button variant="secondary" onClick={onUse} className="self-start">
        Fill in demo login
      </Button>
    </div>
  );
}
