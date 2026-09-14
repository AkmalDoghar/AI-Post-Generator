"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "../../components/AppShell";

const PLATFORMS = [
  { id: "linkedin", label: "LinkedIn" },
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "twitter", label: "Twitter / X" },
];

export default function DashboardPage() {
  const [username, setUsername] = useState("octocat");
  const [days, setDays] = useState(7);
  const [summary, setSummary] = useState(null);
  const [platform, setPlatform] = useState("linkedin");
  const [draft, setDraft] = useState("");
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function pullActivity() {
    setError("");
    setLoadingActivity(true);
    setSummary(null);
    setDraft("");

    try {
      const res = await fetch(
        `/api/github-activity?username=${encodeURIComponent(username)}&days=${days}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch activity.");
      setSummary(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingActivity(false);
    }
  }

  async function draftPost(nextPlatform = platform) {
    if (!summary) return;
    setError("");
    setLoadingDraft(true);
    setPlatform(nextPlatform);

    try {
      const res = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary, platform: nextPlatform }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate post.");
      setDraft(data.post);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingDraft(false);
    }
  }

  const selectedPlatformLabel = useMemo(
    () => PLATFORMS.find((p) => p.id === platform)?.label || "LinkedIn",
    [platform]
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker">Dashboard</p>
            <h2 className="page-title mt-2">Generate your GitPulse post</h2>
          </div>
          <div className="data-pill inline-flex items-center rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.2em]">
            {mounted ? "Live sync" : "Loading..."}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
          <aside className="glass-panel space-y-5 rounded-3xl p-5">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-slate-400">
                GitHub username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="octocat"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-slate-400">
                Time window
              </label>
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              >
                <option value={1}>Last day</option>
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
              </select>
            </div>

            <button
              onClick={pullActivity}
              disabled={!username || loadingActivity}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 px-4 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loadingActivity ? "Pulling activity..." : "Pull activity"}
            </button>

            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {summary && (
              <div className="metric-card p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Activity · last {summary.windowDays}d
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-200">
                  <div className="flex items-center justify-between">
                    <span>Commits</span>
                    <span className="font-semibold text-emerald-300">+ {summary.commitCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Pull requests</span>
                    <span className="font-semibold text-emerald-300">+ {summary.pullRequests.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>New repos</span>
                    <span className="font-semibold text-emerald-300">+ {summary.newRepos.length}</span>
                  </div>
                  {summary.topLanguages.length > 0 && (
                    <div className="pt-2 text-xs text-slate-400">
                      Languages: {summary.topLanguages.join(", ")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </aside>

          <section className="glass-panel space-y-5 rounded-3xl p-5">
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => draftPost(p.id)}
                  disabled={!summary || loadingDraft}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    platform === p.id
                      ? "border-cyan-400 bg-cyan-500/15 text-white"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/40"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {!summary && (
              <div className="editor-surface rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-8 text-center text-slate-400">
                Pull your GitHub activity to generate a social post draft.
              </div>
            )}

            {summary && (
              <div className="editor-surface overflow-hidden rounded-2xl">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Draft · {selectedPlatformLabel}
                  </div>
                  <button
                    onClick={async () => {
                      if (!draft) return;
                      try {
                        await navigator.clipboard.writeText(draft);
                      } catch {}
                    }}
                    disabled={!draft}
                    className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Copy
                  </button>
                </div>

                <textarea
                  value={loadingDraft ? "Drafting..." : draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={12}
                  readOnly={loadingDraft}
                  placeholder="Your draft will appear here..."
                  className="w-full resize-none bg-transparent p-4 text-sm leading-7 text-slate-100 outline-none placeholder:text-slate-500"
                />
              </div>
            )}

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              Nothing is posted automatically. Review, edit, and copy your draft into the platform you want to publish on.
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
