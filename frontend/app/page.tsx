import type { Metadata } from "next";
import Auth from "@/features/auth/auth";

export const metadata: Metadata = {
  title: "Log in",
};

// The login screen is the landing page; a demo login opens /dashboard.
export default function LandingPage() {
  return <Auth mode="login" />;
}
