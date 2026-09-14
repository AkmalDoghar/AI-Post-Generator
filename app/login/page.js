"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("example@gitpulse");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    setTimeout(() => {
      window.localStorage.setItem("gitpulse-auth", "true");
      router.push("/dashboard");
      setLoading(false);
    }, 600);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),transparent_32%),linear-gradient(135deg,#020817_0%,#0f172a_40%,#111827_100%)] text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-8">
          <Link href="/" className="inline-flex items-center gap-3 text-sm text-slate-300 transition hover:text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 font-black text-slate-950">G</span>
            GitPulse
          </Link>

          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Developer brand engine</p>
            <h1 className="max-w-xl text-5xl font-black tracking-tight text-white sm:text-6xl">
              Turn GitHub activity into polished social posts.
            </h1>
            <p className="max-w-lg text-lg text-slate-300">
              Build in public, ship consistently, and turn your commits into a story people actually want to read.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { value: "2.4x", label: "More consistency" },
              { value: "7 days", label: "Weekly summary" },
              { value: "4 formats", label: "Platform drafts" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">{item.value}</div>
                <div className="mt-1 text-sm text-slate-300">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl sm:p-8">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Welcome back</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Sign in</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-sm text-slate-400">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-white/10 bg-slate-950" />
                Remember me
              </label>
              <a href="#" className="text-cyan-300 hover:text-cyan-200">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 px-4 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Need an account? <a href="#" className="text-cyan-300 hover:text-cyan-200">Request access</a>
          </div>
        </div>
      </div>
    </main>
  );
}
