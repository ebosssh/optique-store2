import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-secondary/20">
      <AdminNav />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
