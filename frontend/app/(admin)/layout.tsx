// Admin screens get their own shell: the same phone-width column as the
// rider app (design.md §3), without the rider bottom nav.
export default function AdminLayout({ children }: LayoutProps<"/">) {
  return <div className="mx-auto flex w-full max-w-md flex-1 flex-col">{children}</div>;
}
