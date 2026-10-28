"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { useLoginRequest } from "../hooks/use-auth-request";
import type { DemoAccount, FieldErrors, LoginInput } from "../types";
import { firstInvalidField, validateLogin } from "../validation";
import { DemoCredentials } from "./demo-credentials";
import { FormError } from "./form-error";

type LoginFormProps = {
  demoAccount: DemoAccount;
};

const EMPTY: LoginInput = { email: "", password: "" };

export function LoginForm({ demoAccount }: LoginFormProps) {
  const [values, setValues] = useState<LoginInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<LoginInput>>({});
  const { state, submit } = useLoginRequest();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  function handleChange(field: keyof LoginInput) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const next = { ...values, [field]: event.target.value };
      setValues(next);
      // Clear an error as soon as the field becomes valid, not only on blur.
      if (errors[field]) setErrors({ ...errors, [field]: validateLogin(next)[field] });
    };
  }

  function handleBlur(field: keyof LoginInput) {
    if (values[field]) setErrors({ ...errors, [field]: validateLogin(values)[field] });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateLogin(values);
    setErrors(nextErrors);
    const invalid = firstInvalidField(nextErrors);
    if (invalid) {
      const input = formRef.current?.elements.namedItem(invalid);
      if (input instanceof HTMLInputElement) input.focus();
      return;
    }
    const result = await submit(values);
    if (result?.ok) router.push("/");
  }

  function fillDemo() {
    setValues({ email: demoAccount.email, password: demoAccount.password });
    setErrors({});
  }

  // Still a demo: no session is created; a matching login just opens the
  // dashboard, which is public and shows demo data.
  const busy = state.status === "submitting" || state.status === "success";

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
      <DemoCredentials account={demoAccount} onUse={fillDemo} />
      {state.status === "error" && <FormError message={state.message} />}
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
        autoComplete="current-password"
        value={values.password}
        error={errors.password}
        onChange={handleChange("password")}
        onBlur={() => handleBlur("password")}
      />
      <Button type="submit" loading={busy} className="w-full">
        {state.status === "success" ? "Opening dashboard…" : busy ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
}
