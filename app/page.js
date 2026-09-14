"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),transparent_25%),linear-gradient(135deg,#020817_0%,#0f172a_35%,#111827_100%)] text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-lg font-black text-slate-950">G</div>
            <div>
              <div className="text-xl font-semibold">GitPulse</div>
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Build in public</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-400/30 hover:text-white">
              Login
            </Link>
            <Link href="/dashboard" className="rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20">
              Launch app
            </Link>
          </div>
        </header>

        <section className="grid items-center gap-10 pb-20 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:pt-24">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-cyan-200">
              Developer growth platform
            </div>

            <h1 className="max-w-xl text-5xl font-black tracking-tight text-white sm:text-6xl">
              Turn daily commits into content that feels worth sharing.
            </h1>

            <p className="max-w-lg text-lg text-slate-300">
              GitPulse collects your GitHub activity and turns it into polished social drafts for LinkedIn, Instagram, Twitter, and more — so you can stay visible without overthinking it.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard" className="rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20">
                Start generating
              </Link>
              <Link href="/analytics" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 font-semibold text-slate-100 transition hover:border-cyan-400/30">
                View analytics
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 pt-2 text-sm text-slate-300">
              <span>GitHub activity syncing</span>
              <span>AI-crafted drafts</span>
              <span>Multi-platform publishing</span>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
            <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(15,23,42,0.9),rgba(16,185,129,0.12))] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-400">This week</div>
                  <div className="mt-2 text-3xl font-bold text-white">24 commits</div>
                </div>
                <div className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-300">+18%</div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  ["Pull requests", "6 opened"],
                  ["New repos", "2 created"],
                  ["Top language", "JavaScript"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-3">
                    <span className="text-slate-300">{label}</span>
                    <span className="font-medium text-white">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3 text-sm text-cyan-100">
                “A steady week of shipping, learning, and tightening the product. The work is compounding.”
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
