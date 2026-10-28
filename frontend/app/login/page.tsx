import type { Metadata } from "next";
import Auth from "@/features/auth/auth";

export const metadata: Metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return <Auth mode="login" />;
}
