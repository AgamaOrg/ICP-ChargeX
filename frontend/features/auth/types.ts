export type AuthMode = "login" | "signup";

export type LoginInput = {
  email: string;
  password: string;
};

export type SignupInput = {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

/** Who the account belongs to: a rider, or the admin of a rental (kiosk operator). */
export type AccountRole = "rider" | "admin";

/** Mock-only account shape; no backend contract exists for accounts yet. */
export type DemoAccount = {
  displayName: string;
  email: string;
  password: string;
  role: AccountRole;
};

export type AuthResult =
  | { ok: true; displayName: string; role: AccountRole }
  | { ok: false; message: string };

export type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; message: string }
  | { status: "success"; displayName: string };
