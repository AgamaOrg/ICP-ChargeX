import type { FieldErrors, LoginInput, SignupInput } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

function emailError(email: string) {
  if (!email.trim()) return "Enter your email.";
  if (!EMAIL_PATTERN.test(email.trim())) return "Enter an email like name@example.com.";
  return undefined;
}

export function validateLogin(input: LoginInput): FieldErrors<LoginInput> {
  return {
    email: emailError(input.email),
    password: input.password ? undefined : "Enter your password.",
  };
}

export function validateSignup(input: SignupInput): FieldErrors<SignupInput> {
  const name = input.displayName.trim();
  return {
    displayName: !name
      ? "Enter your name."
      : name.length < 2 || name.length > 40
        ? "Use 2 to 40 characters."
        : undefined,
    email: emailError(input.email),
    password:
      input.password.length < MIN_PASSWORD_LENGTH
        ? `Use at least ${MIN_PASSWORD_LENGTH} characters.`
        : undefined,
    confirmPassword: !input.confirmPassword
      ? "Re-enter your password."
      : input.confirmPassword !== input.password
        ? "Passwords don't match."
        : undefined,
  };
}

/** First field with an error, in form order, so focus can move to it. */
export function firstInvalidField<T>(errors: FieldErrors<T>): keyof T | undefined {
  return (Object.keys(errors) as Array<keyof T>).find((field) => errors[field]);
}
