"use client";

import Link from "next/link";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { useSignupRequest } from "../hooks/use-auth-request";
import type { FieldErrors, SignupInput } from "../types";
import { firstInvalidField, validateSignup } from "../validation";
import { FormError } from "./form-error";

const EMPTY: SignupInput = { displayName: "", email: "", password: "", confirmPassword: "" };

export function SignupForm() {
  const [values, setValues] = useState<SignupInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<SignupInput>>({});
  const { state, submit } = useSignupRequest();
  const formRef = useRef<HTMLFormElement>(null);

  function handleChange(field: keyof SignupInput) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const next = { ...values, [field]: event.target.value };
      setValues(next);
      // Clear an error as soon as the field becomes valid, not only on blur.
      if (errors[field]) setErrors({ ...errors, [field]: validateSignup(next)[field] });
    };
  }

  function handleBlur(field: keyof SignupInput) {
    if (values[field]) setErrors({ ...errors, [field]: validateSignup(values)[field] });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateSignup(values);
    setErrors(nextErrors);
    const invalid = firstInvalidField(nextErrors);
    if (invalid) {
      const input = formRef.current?.elements.namedItem(invalid);
      if (input instanceof HTMLInputElement) input.focus();
      return;
    }
    await submit(values);
  }

  if (state.status === "success") {
    return (
      <div role="status" className="flex flex-col gap-4">
        <div className="flex gap-2 rounded-md bg-success-soft p-3 text-sm text-success">
          <span aria-hidden="true">✓</span>
          <p>Demo account created for {state.displayName}.</p>
        </div>
        <p className="text-sm text-ink-muted">
          It only exists in this browser tab. Reloading the page clears it.
        </p>
        <Link
          href="/login"
          className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          Log in
        </Link>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
      {state.status === "error" && <FormError message={state.message} />}
      <TextField
        label="Name"
        name="displayName"
        autoComplete="name"
        value={values.displayName}
        error={errors.displayName}
        onChange={handleChange("displayName")}
        onBlur={() => handleBlur("displayName")}
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        value={values.email}
        error={errors.email}
        onChange={handleChange("email")}
        onBlur={() => handleBlur("email")}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        hint="At least 8 characters."
        value={values.password}
        error={errors.password}
        onChange={handleChange("password")}
        onBlur={() => handleBlur("password")}
      />
      <TextField
        label="Confirm password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        value={values.confirmPassword}
        error={errors.confirmPassword}
        onChange={handleChange("confirmPassword")}
        onBlur={() => handleBlur("confirmPassword")}
      />
      <Button type="submit" loading={state.status === "submitting"} className="w-full">
        {state.status === "submitting" ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
