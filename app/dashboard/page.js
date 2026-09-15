"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppShell from "../../components/AppShell";

const PLATFORMS = [
  { id: "linkedin", label: "LinkedIn" },
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
];

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const [username, setUsername] = useState("");
  const [days, setDays] = useState(7);
  const [summary, setSummary] = useState(null);
  const [platform, setPlatform] = useState("linkedin");
  const [draft, setDraft] = useState("");
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetch("/api/github-connection")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.connected) setUsername(data.username);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (searchParams.get("new") !== "1") return;
    setSummary(null);
    setDraft("");
    setPlatform("linkedin");
    setError("");
    router.replace("/dashboard");
  }, [router, searchParams]);

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
      await fetch("/api/github-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });
      await draftPost(data, "linkedin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingActivity(false);
    }
  }

  async function draftPost(activitySummary = summary, nextPlatform = platform) {
    if (!activitySummary) return;
    setError("");
    setLoadingDraft(true);
    setPlatform(nextPlatform);

    try {
      const res = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary: activitySummary, platform: nextPlatform }),
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
      <div className="dashboard-page space-y-6">
        <div className="dashboard-heading">
          <div>
            <div className="dashboard-kicker"><span /> Content studio</div>
            <h2 className="dashboard-title">Turn your week into a story.</h2>
            <p className="dashboard-subtitle">Pull the work, find the signal, and shape a post worth sharing.</p>
          </div>
          <div className="dashboard-status"><i /> {mounted ? "Workspace live" : "Loading workspace"}</div>
        </div>

        <div className="dashboard-stats">
          <div><span>Activity source</span><strong>GitHub</strong><small>Ready to sync</small></div>
          <div><span>Draft status</span><strong>{draft ? "Ready" : "Waiting"}</strong><small>{draft ? `${selectedPlatformLabel} draft` : "Pull activity to begin"}</small></div>
          <div><span>Publishing mode</span><strong>Manual review</strong><small>Nothing posts automatically</small></div>
        </div>

        <div className="dashboard-workspace">
          <aside className="dashboard-source">
            <div className="dashboard-panel-heading"><span className="dashboard-step">01</span><div><h3>Find your signal</h3><p>Choose a GitHub source and time window.</p></div></div>
            <div className="dashboard-field">
              <label>GitHub username</label>
              <input
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setSummary(null);
                  setDraft("");
                  setError("");
                }}
                placeholder="your-github-name"
                className="dashboard-input"
              />
            </div>

            <div className="dashboard-field">
              <label>Time window</label>
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="dashboard-input"
              >
                <option value={1}>Last day</option>
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
              </select>
            </div>

            <button
              onClick={pullActivity}
              disabled={!username || loadingActivity}
              className="dashboard-primary-button"
            >
              {loadingActivity ? "Analyzing & drafting..." : "Connect & create post"}
            </button>

            {error && (
              <div className="dashboard-error">
                {error}
              </div>
            )}

            {summary && (
              <div className="dashboard-activity-card">
                <div className="dashboard-card-label">
                  Activity · last {summary.windowDays}d
                </div>

                <div className="dashboard-activity-list">
                  <div>
                    <span>Commits</span>
                    <span className="font-semibold text-emerald-300">+ {summary.commitCount}</span>
                  </div>
                  <div>
                    <span>Pull requests</span>
                    <span className="font-semibold text-emerald-300">+ {summary.pullRequests.length}</span>
                  </div>
                  <div>
                    <span>New repos</span>
                    <span className="font-semibold text-emerald-300">+ {summary.newRepos.length}</span>
                  </div>
                  {summary.topLanguages.length > 0 && (
                    <div className="dashboard-languages">
                      Languages: {summary.topLanguages.join(", ")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </aside>

          <section className="dashboard-draft-panel">
            <div className="dashboard-panel-heading"><span className="dashboard-step">02</span><div><h3>Shape the story</h3><p>Select a platform and generate a human draft.</p></div></div>
            <div className="dashboard-platforms">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => draftPost(summary, p.id)}
                  disabled={!summary || loadingDraft}
                  className={`dashboard-platform ${
                    platform === p.id
                      ? "dashboard-platform-active"
                      : ""
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {!summary && (
              <div className="dashboard-empty-state">
                <span className="dashboard-empty-icon">✦</span>
                <strong>Your story is waiting.</strong>
                <p>Pull GitHub activity on the left to turn a week of work into a polished draft.</p>
              </div>
            )}

            {summary && (
              <div className="dashboard-editor">
                <div className="dashboard-editor-header">
                  <div className="dashboard-card-label">
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
                    className="dashboard-copy-button"
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
                  className="dashboard-textarea"
                />
              </div>
            )}

            <div className="dashboard-note">
              Nothing is posted automatically. Review, edit, and copy your draft into the platform you want to publish on.
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
