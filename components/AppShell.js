"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/history", label: "Drafts" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" },
];

export default function AppShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const authed = window.localStorage.getItem("gitpulse-auth");
    if (!authed && pathname !== "/login") {
      router.replace("/login");
    }
  }, [pathname, router]);

  const handleLogout = () => {
    window.localStorage.removeItem("gitpulse-auth");
    router.push("/login");
  };

  return (
    <div className="app-shell min-h-screen text-slate-100">
      <div className="mx-auto flex max-w-[1600px]">
        <aside className="hidden min-h-screen w-72 border-r border-white/10 bg-slate-950/60 p-6 lg:flex lg:flex-col">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/30">
              G
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight">GitPulse</div>
              <div className="text-xs text-slate-400">Build in public</div>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link flex items-center justify-between rounded-xl px-3 py-2.5 text-sm ${
                    active
                      ? "bg-white/8 text-white shadow-inner shadow-white/5"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-slate-500">0{navItems.indexOf(item) + 1}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-emerald-500/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Pro insight</p>
            <p className="mt-2 text-sm text-slate-200">
              Your weekly Git activity is trending upward. Keep sharing the progress.
            </p>
          </div>
        </aside>

        <main className="flex-1">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 lg:hidden">
                  G
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">Workspace</p>
                  <h1 className="text-lg font-semibold text-white">GitPulse Studio</h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 sm:inline-flex">
                  + New draft
                </button>
                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-2 py-1.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-cyan-500 text-xs font-bold text-slate-950">
                    AD
                  </div>
                  <div className="hidden text-left sm:block">
                    <div className="text-xs font-medium text-white">Adnan</div>
                    <div className="text-[10px] text-slate-400">Pro plan</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="rounded-full border border-white/10 bg-slate-900 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300 transition hover:border-cyan-400/40 hover:text-white"
                  >
                    logout
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div className="grid-overlay p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
