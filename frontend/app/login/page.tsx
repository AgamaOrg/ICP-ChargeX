import { redirect } from "next/navigation";

// Login now lives at "/". Kept so old links and bookmarks still work.
export default function LoginPage() {
  redirect("/");
}
