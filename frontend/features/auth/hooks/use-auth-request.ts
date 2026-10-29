import { useState } from "react";
import { simulateLogin, simulateSignup } from "../data/mock";
import type { AuthResult, LoginInput, SignupInput, SubmitState } from "../types";

// Wraps the mock request so components never import mocks directly; swapping
// in a real adapter later only changes this file.
function useAuthRequest<T>(request: (input: T) => Promise<AuthResult>) {
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function submit(input: T): Promise<AuthResult | undefined> {
    if (state.status === "submitting") return undefined;
    setState({ status: "submitting" });
    const result = await request(input);
    setState(
      result.ok
        ? { status: "success", displayName: result.displayName }
        : { status: "error", message: result.message },
    );
    return result;
  }

  return { state, submit, reset: () => setState({ status: "idle" }) };
}

export function useLoginRequest() {
  return useAuthRequest<LoginInput>(simulateLogin);
}

export function useSignupRequest() {
  return useAuthRequest<SignupInput>(simulateSignup);
}
