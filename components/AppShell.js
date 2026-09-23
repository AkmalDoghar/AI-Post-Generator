"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import BrandLogo from "./BrandLogo";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/history", label: "Drafts" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" },
  { href: "/privacy", label: "Privacy Policy" },
];

export default function AppShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    let active = true;

    fetch("/api/auth/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (active && data?.user) setUser(data.user);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  };

  const displayName = user?.name || "Workspace member";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "WM";

  return (
    <div className="app-shell min-h-screen text-slate-100">
      <div className="mx-auto flex max-w-[1600px]">
        <aside className="hidden min-h-screen w-72 border-r border-white/10 bg-slate-950/60 p-6 lg:flex lg:flex-col">
          <div className="mb-10">
            <BrandLogo compact />
            <div className="mt-2 pl-1 text-xs text-slate-400">Build in public</div>
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
                <div className="lg:hidden"><BrandLogo compact /></div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">Workspace</p>
                  <h1 className="text-lg font-semibold text-white">GitPulse Studio</h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => router.push("/dashboard?new=1")} className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 transition hover:border-cyan-400/40 hover:text-white sm:inline-flex">
                  + New draft
                </button>
                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setProfileOpen((open) => !open)}
                    aria-expanded={profileOpen}
                    className="flex items-center gap-2.5 rounded-full border border-emerald-500/20 bg-slate-900/90 p-1 pr-3 text-left transition hover:border-emerald-400/50 hover:bg-slate-900"
                  >
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={displayName}
                        className="h-8 w-8 rounded-full object-cover border border-emerald-400/40 shadow-sm"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-xs font-extrabold text-slate-950 shadow-sm">
                        {initials}
                      </div>
                    )}
                    <div className="hidden text-left sm:block">
                      <div className="text-xs font-semibold text-slate-100">{displayName}</div>
                      <div className="max-w-[10rem] truncate text-[10px] text-emerald-400/80 font-mono">
                        {user?.email || "Loading..."}
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 ml-0.5">⌄</span>
                  </button>

                  {profileOpen && (
                    <div className="profile-menu">
                      <div className="profile-menu-heading">
                        {user?.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={displayName}
                            className="h-10 w-10 rounded-full object-cover border-2 border-emerald-400/50 flex-shrink-0"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-sm font-black text-slate-950 flex-shrink-0 shadow-md">
                            {initials}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <strong>{displayName}</strong>
                          <span>{user?.email || "Account member"}</span>
                          {user?.bio && (
                            <p className="text-[10px] text-slate-400 truncate mt-0.5 italic">
                              &ldquo;{user.bio}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="profile-menu-nav-kicker">Workspace</div>

                      <Link href="/settings" onClick={() => setProfileOpen(false)} className="pm-item">
                        <span>⚙️</span> Account Settings
                      </Link>

                      <Link href="/privacy" onClick={() => setProfileOpen(false)} className="pm-item">
                        <span>🛡️</span> Privacy Policy
                      </Link>

                      <Link href="/workflow" onClick={() => setProfileOpen(false)} className="pm-item">
                        <span>⚡</span> Workflow & Setup
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="pm-item pm-item-danger"
                      >
                        <span>🚪</span> Log out
                      </button>
                    </div>
                  )}
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
