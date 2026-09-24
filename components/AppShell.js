"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import BrandLogo from "./BrandLogo";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "⌂" },
  { href: "/history", label: "Drafts", icon: "✎" },
  { href: "/analytics", label: "Analytics", icon: "◒" },
  { href: "/settings", label: "Settings", icon: "⚙" },
  { href: "/privacy", label: "Privacy", icon: "◌" },
];

export default function AppShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSidebarOpen]);

  // Close mobile sidebar on Escape key press
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setMobileSidebarOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
        {/* Workspace Sidebar Drawer (Mobile Slide-out & Desktop Column) */}
        <aside
          id="workspace-sidebar"
          className={`app-sidebar min-h-screen w-72 flex-col border-r border-white/10 bg-slate-950/90 p-5 lg:flex${
            mobileSidebarOpen ? " app-sidebar-mobile-open" : ""
          }`}
        >
          {/* Sidebar Brand Header */}
          <div className="app-sidebar-brand mb-6 border-b border-white/10 pb-4">
            <div className="app-sidebar-topline flex items-center justify-between">
              <BrandLogo compact />
              <button
                type="button"
                className="app-sidebar-close flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-900/80 text-slate-400 transition hover:border-emerald-400/50 hover:bg-emerald-500/10 hover:text-emerald-300 lg:hidden"
                onClick={() => setMobileSidebarOpen(false)}
                aria-label="Close workspace navigation"
              >
                <span aria-hidden="true" className="text-lg leading-none">✕</span>
              </button>
            </div>
            <div className="app-sidebar-caption mt-2 flex items-center gap-2 pl-1 text-[10px] uppercase tracking-[0.2em] text-emerald-400/80">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              GitPulse Studio Workspace
            </div>
          </div>

          <div className="app-sidebar-section-label mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Workspace Navigation
          </div>

          {/* Navigation Links */}
          <nav className="app-nav space-y-1.5 flex-1" aria-label="Workspace navigation">
            {navItems.map((item, index) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`nav-link group flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
                    active
                      ? "bg-gradient-to-r from-emerald-500/15 to-cyan-500/5 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-950/40"
                      : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
                  }`}
                >
                  <span className="app-nav-label flex items-center gap-3">
                    <span
                      className={`app-nav-icon text-base transition-colors ${
                        active
                          ? "text-emerald-400 font-bold"
                          : "text-slate-400 group-hover:text-emerald-300"
                      }`}
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    {active && (
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/80" />
                    )}
                    <span className="app-nav-number font-mono text-[10px] text-slate-500">
                      0{index + 1}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Mobile User Profile & Pro Insight Card */}
          <div className="space-y-3 pt-4 border-t border-slate-800/80 mt-auto">
            {/* Mobile User Info */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={displayName}
                  className="h-9 w-9 rounded-full object-cover border border-emerald-400/50"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-xs font-black text-slate-950">
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{displayName}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email || "Workspace User"}</p>
              </div>
            </div>

            {/* Pro Insight Card */}
            <div className="app-sidebar-insight rounded-xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-emerald-500/10 p-3">
              <div className="flex items-start gap-2.5">
                <span className="text-cyan-300 text-xs mt-0.5">↗</span>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-cyan-300">Pro insight</p>
                  <p className="mt-1 text-xs text-slate-300 leading-snug">
                    Your weekly Git activity is trending upward. Keep sharing the progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 w-full overflow-x-hidden">
          <header className="app-header sticky top-0 z-20 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
            <div className="app-header-inner flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div className="app-mobile-brand flex items-center gap-3">
                <div className="app-mobile-header-actions lg:hidden">
                  <button
                    type="button"
                    className="app-menu-button"
                    onClick={() => setMobileSidebarOpen((open) => !open)}
                    aria-expanded={mobileSidebarOpen}
                    aria-controls="workspace-sidebar"
                    aria-label={mobileSidebarOpen ? "Close workspace navigation" : "Open workspace navigation"}
                  >
                    <span aria-hidden="true">{mobileSidebarOpen ? "×" : "☰"}</span>
                  </button>
                  <BrandLogo compact />
                </div>
                <div className="app-workspace-title">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">Workspace</p>
                  <h1 className="text-lg font-semibold text-white">GitPulse Studio</h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => router.push("/dashboard?new=1")} className="app-new-draft hidden rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 transition hover:border-cyan-400/40 hover:text-white sm:inline-flex">
                  <span aria-hidden="true">+</span> New draft
                </button>
                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setProfileOpen((open) => !open)}
                    aria-expanded={profileOpen}
                    className="app-profile-trigger flex items-center gap-2.5 rounded-full border border-emerald-500/20 bg-slate-900/90 p-1 pr-3 text-left transition hover:border-emerald-400/50 hover:bg-slate-900"
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

          {/* Animated Glassmorphic Mobile Backdrop Overlay */}
          {mobileSidebarOpen && (
            <button
              type="button"
              className="app-sidebar-backdrop lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
              aria-label="Close workspace navigation"
            />
          )}

          <div className="grid-overlay p-4 sm:p-6 lg:p-8 min-w-0 w-full overflow-x-hidden">{children}</div>
        </main>
      </div>
    </div>
  );
}
