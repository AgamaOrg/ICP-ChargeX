import type { Metadata } from "next";
import Auth from "@/features/auth/auth";

export const metadata: Metadata = {
  title: "Create account",
};

export default function SignupPage() {
  return <Auth mode="signup" />;
}
