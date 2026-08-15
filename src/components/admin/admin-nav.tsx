"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Glasses, LayoutDashboard, LogOut, Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Огляд", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Товари", icon: Package, exact: false },
  { href: "/admin/orders", label: "Замовлення", icon: ShoppingBag, exact: false },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3">
        <Link href="/admin" className="flex items-center gap-2 font-heading text-lg font-bold text-primary">
          <Glasses className="size-5" /> OptikaZir · Адмін
        </Link>
        <nav className="ml-6 flex items-center gap-1">
          {LINKS.map((link) => {
            const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium",
                  active ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-secondary/60"
                )}
              >
                <link.icon className="size-4" /> {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/" target="_blank" className="text-sm text-muted-foreground hover:text-foreground">
            Переглянути сайт
          </Link>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="size-4" /> Вийти
          </Button>
        </div>
      </div>
    </header>
  );
}
