import type { AuthResult, DemoAccount, LoginInput, SignupInput } from "../types";

// Hardcoded on purpose and shown on the login screen: there is no auth
// provider yet (rules.md §1). Real login will be Internet Identity, behind an
// adapter in data/adapters/.
export const mockDemoAccounts: DemoAccount[] = [
  { displayName: "Alex", email: "demo@chargex.test", password: "chargex-demo", role: "rider" },
  { displayName: "Rental admin", email: "admin@chargex.test", password: "chargex-admin", role: "admin" },
];

const SIMULATED_LATENCY_MS = 600;

// Accounts created through sign-up live only in this module's memory, so a
// page reload clears them.
const mockAccounts: DemoAccount[] = [...mockDemoAccounts];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function findAccount(email: string) {
  const normalized = email.trim().toLowerCase();
  return mockAccounts.find((account) => account.email.toLowerCase() === normalized);
}

export async function simulateLogin({ email, password }: LoginInput): Promise<AuthResult> {
  await delay(SIMULATED_LATENCY_MS);
  const account = findAccount(email);
  if (!account || account.password !== password) {
    return {
      ok: false,
      message: "That email and password don't match. Use one of the demo logins above.",
    };
  }
  return { ok: true, displayName: account.displayName, role: account.role };
}

export async function simulateSignup({ displayName, email, password }: SignupInput): Promise<AuthResult> {
  await delay(SIMULATED_LATENCY_MS);
  if (findAccount(email)) {
    return { ok: false, message: "An account with this email already exists. Log in instead." };
  }
  mockAccounts.push({ displayName: displayName.trim(), email: email.trim(), password, role: "rider" });
  return { ok: true, displayName: displayName.trim(), role: "rider" };
}
