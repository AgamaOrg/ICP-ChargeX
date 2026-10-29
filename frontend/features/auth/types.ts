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

/** Mock-only account shape; no backend contract exists for accounts yet. */
export type DemoAccount = {
  displayName: string;
  email: string;
  password: string;
};

export type AuthResult = { ok: true; displayName: string } | { ok: false; message: string };

export type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; message: string }
  | { status: "success"; displayName: string };
