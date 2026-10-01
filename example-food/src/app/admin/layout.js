"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChefHat, LayoutGrid, Truck } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { AccountMenu } from "./_components/account-menu";

const NAV_ITEMS = [
  { label: "Food menu", href: "/admin/food-menu", icon: LayoutGrid },
  { label: "Orders", href: "/admin/orders", icon: Truck },
];

export default function AdminLayout({ children }) {
  const { user, ready } = useAuth();
  const pathname = usePathname();

  if (!ready) return null;

  if (user?.role !== "admin") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
        <div className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-red-500">Access denied</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Admin only</h1>
          <p className="mt-2 text-slate-600">Please sign in with an admin account.</p>
          <Link href="/login" className="mt-5 inline-block rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            Go to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-100 text-slate-900">
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3 pb-8">
          <div className="flex size-10 items-center justify-center rounded-xl bg-red-500 text-white">
            <ChefHat className="size-5" />
          </div>
          <div>
            <p className="text-base font-bold leading-tight text-slate-900">NomNom</p>
            <p className="text-xs text-slate-400">Swift delivery</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname?.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col gap-6 p-8">
        <div className="flex justify-end">
          <AccountMenu />
        </div>
        {children}
      </main>
    </div>
  );
}
