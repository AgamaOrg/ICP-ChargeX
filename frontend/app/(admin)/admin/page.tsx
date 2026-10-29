import type { Metadata } from "next";
import Admin from "@/features/admin/admin";

export const metadata: Metadata = {
  title: "Rental admin",
};

export default function AdminPage() {
  return <Admin />;
}
