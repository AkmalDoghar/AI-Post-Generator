"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../../components/AppShell";
import StoryEngineBanner from "../../components/StoryEngineBanner";
import AngleSelector from "../../components/AngleSelector";
import DraftInspector from "../../components/DraftInspector";
import EvidenceModal from "../../components/EvidenceModal";
import WeeklyRecapModal from "../../components/WeeklyRecapModal";

const PLATFORMS = [
  { id: "linkedin", label: "LinkedIn" },
  { id: "twitter", label: "X / Twitter" },
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
];

const TONES = [
  { id: "professional", label: "Professional" },
  { id: "casual", label: "Casual" },
  { id: "technical", label: "Technical" },
  { id: "storytelling", label: "Storytelling" },
  { id: "personal", label: "Personal" },
];

const LENGTHS = [
  { id: "short", label: "Short" },
  { id: "medium", label: "Medium" },
  { id: "long", label: "Long" },
];

export default function DashboardPage() {
  const [username, setUsername] = useState("");
  const [days, setDays] = useState(7);
  const [summary, setSummary] = useState(null);
  const [storyAnalysis, setStoryAnalysis] = useState(null);

  const [angle, setAngle] = useState("auto_ai");
  const [platform, setPlatform] = useState("linkedin");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");

  const [drafts, setDrafts] = useState([]);

  const [loadingActivity, setLoadingActivity] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetch("/api/github-connection")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.connected) setUsername(data.username);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("new") === "1") {
      setSummary(null);
      setStoryAnalysis(null);
      setDrafts([]);
      setAngle("auto_ai");
      setPlatform("linkedin");
      setError("");
      router.replace("/dashboard");
    }
  }, [router]);

  // Step 1: Pull GitHub Activity & AI Story Analysis
  async function pullActivity() {
    if (!username.trim()) return;
    setError("");
    setLoadingActivity(true);
    setSummary(null);
    setStoryAnalysis(null);
    setDrafts([]);

    try {
      const res = await fetch(
        `/api/github-activity?username=${encodeURIComponent(username.trim())}&days=${days}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch GitHub activity.");

      setSummary(data.summary);
      setStoryAnalysis(data.storyAnalysis);

      await fetch("/api/github-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });

      // Auto-trigger initial draft generation
      await generateDrafts({
        activitySummary: data.summary,
        selectedAngle: angle,
        selectedPlatform: platform,
        selectedTone: tone,
        selectedLength: length,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingActivity(false);
    }
  }

  // Step 2: Generate Post Variations via GitPulse Content Engine
  async function generateDrafts({
    activitySummary = summary,
    selectedAngle = angle,
    selectedPlatform = platform,
    selectedTone = tone,
    selectedLength = length,
  } = {}) {
    if (!activitySummary) return;
    setError("");
    setLoadingDraft(true);

    try {
      const res = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: activitySummary,
          angle: selectedAngle,
          tone: selectedTone,
          length: selectedLength,
          platform: selectedPlatform,
          multiDraft: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate post draft.");

      setDrafts(data.drafts || []);
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
      <div className="dashboard-page space-y-8 max-w-7xl mx-auto px-4 py-6">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> GitPulse 2.0 Content Engine
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Turn your GitHub activity into authentic social stories.
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              GitPulse analyzes your commits, detects key engineering accomplishments, verifies facts, and shapes platform-perfect posts with zero AI fluff.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {summary && (
              <button
                onClick={() => setShowWeeklyModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2"
              >
                <span>📊</span> Weekly Story Recap
              </button>
            )}
            <div className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {mounted ? "Workspace Live" : "Loading"}
            </div>
          </div>
        </div>

        {/* 6-Step Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Activity & Controls Studio (5 cols) */}
          <aside className="lg:col-span-5 space-y-6">
            {/* Step 01: Find Signal / GitHub Source */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur-md">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-extrabold text-xs flex items-center justify-center border border-emerald-500/40">
                  01
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">Your GitHub Activity</h3>
                  <p className="text-xs text-slate-400">Specify GitHub handle & timeframe</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    GitHub Username
                  </label>
                  <input
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setSummary(null);
                      setStoryAnalysis(null);
                      setDrafts([]);
                      setError("");
                    }}
                    placeholder="e.g. AkmalDoghar"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Time Window
                  </label>
                  <select
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value={1}>Last 24 Hours</option>
                    <option value={7}>Last 7 Days</option>
                    <option value={30}>Last 30 Days</option>
                  </select>
                </div>

                <button
                  onClick={pullActivity}
                  disabled={!username.trim() || loadingActivity}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loadingActivity ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Analyzing GitHub Activity...
                    </>
                  ) : (
                    <>Analyze Activity & Build Story</>
                  )}
                </button>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300">
                    {error}
                  </div>
                )}
              </div>

              {/* Activity Quick Stats */}
              {summary && (
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>Activity · Last {summary.windowDays}d</span>
                    <span className="text-emerald-400 font-bold">{summary.username}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Commits</span>
                      <span className="font-extrabold text-emerald-300 text-sm">+{summary.commitCount}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">PRs</span>
                      <span className="font-extrabold text-emerald-300 text-sm">+{summary.pullRequests?.length || 0}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Repos</span>
                      <span className="font-extrabold text-emerald-300 text-sm">+{summary.newRepos?.length || 0}</span>
                    </div>
                  </div>

                  {summary.topLanguages?.length > 0 && (
                    <div className="text-[11px] text-slate-400 pt-1">
                      Languages: <span className="text-slate-200 font-medium">{summary.topLanguages.join(", ")}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 04: Controls Studio (Platform, Tone, Length) */}
            {summary && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur-md">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-extrabold text-xs flex items-center justify-center border border-emerald-500/40">
                    04
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">Generation Studio</h3>
                    <p className="text-xs text-slate-400">Configure target platform, tone & length</p>
                  </div>
                </div>

                {/* Target Platform */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Platform</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PLATFORMS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setPlatform(p.id);
                          generateDrafts({ selectedPlatform: p.id });
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                          platform === p.id
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tone Chips */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Tone</label>
                  <div className="flex flex-wrap gap-1.5">
                    {TONES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setTone(t.id);
                          generateDrafts({ selectedTone: t.id });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          tone === t.id
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Length Chips */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Length</label>
                  <div className="flex gap-2">
                    {LENGTHS.map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => {
                          setLength(l.id);
                          generateDrafts({ selectedLength: l.id });
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all text-center ${
                          length === l.id
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => generateDrafts()}
                  disabled={loadingDraft}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {loadingDraft ? "Generating variations..." : "⚡ Regenerate 3 Variations"}
                </button>
              </div>
            )}
          </aside>

          {/* Right Column: Story Detection, Angles, & Draft Inspector (7 cols) */}
          <main className="lg:col-span-7 space-y-6">
            {!summary && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl mx-auto border border-emerald-500/20">
                  ✦
                </div>
                <h3 className="text-base font-bold text-white">Your Story Engine is Ready</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Enter your GitHub username on the left to analyze your recent commits and generate multi-angle social media posts backed by evidence.
                </p>
              </div>
            )}

            {summary && storyAnalysis && (
              <>
                {/* Step 02: Story Engine Banner */}
                <StoryEngineBanner
                  storyAnalysis={storyAnalysis}
                  onOpenEvidence={() => setShowEvidenceModal(true)}
                />

                {/* Step 03: Story Angles */}
                <AngleSelector
                  selectedAngle={angle}
                  onSelectAngle={(newAngle) => {
                    setAngle(newAngle);
                    generateDrafts({ selectedAngle: newAngle });
                  }}
                />

                {/* Step 05: Draft Inspector */}
                <DraftInspector
                  drafts={drafts}
                  platformLabel={selectedPlatformLabel}
                  onOpenEvidence={() => setShowEvidenceModal(true)}
                />
              </>
            )}
          </main>
        </div>

        {/* Modals */}
        <EvidenceModal
          isOpen={showEvidenceModal}
          onClose={() => setShowEvidenceModal(false)}
          storyAnalysis={storyAnalysis}
          summary={summary}
        />

        <WeeklyRecapModal
          isOpen={showWeeklyModal}
          onClose={() => setShowWeeklyModal(false)}
          summary={summary}
          storyAnalysis={storyAnalysis}
        />
      </div>
    </AppShell>
  );
}
