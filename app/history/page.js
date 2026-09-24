"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppShell from "../../components/AppShell";

const SAMPLE_DRAFTS = [
  {
    id: "draft-1",
    title: "Overhauled Mobile Navigation Drawer in Next.js 14",
    platform: "LinkedIn",
    date: "2026-09-23",
    status: "Published",
    qualityScore: 94,
    angle: "Architecture Shift",
    text: `🚀 Just completely redesigned our workspace mobile navigation using Next.js 14 & CSS glassmorphism!\n\nKey highlights:\n- Body scroll locking & keyboard escape gestures for touch screens\n- 24px backdrop blur with dark cyan neon aesthetics\n- 0ms latency client-side route transitions\n\nWhat's your go-to pattern for responsive navigation in Next.js? Let's discuss below! 👇\n\n#webdev #nextjs #react #javascript #uiux`,
  },
  {
    id: "draft-2",
    title: "Shipped Fact Verification Engine for AI Post Generation",
    platform: "Twitter",
    date: "2026-09-21",
    status: "Saved",
    qualityScore: 96,
    angle: "Behind the Spec",
    text: `Shipped a zero-hallucination fact verification engine today ⚡\n\nIt cross-references every commit payload against AI draft claims before outputting social stories.\n\nNo fake metrics. No AI fluff. Only verified code changes.\n\nBuilt with TypeScript & OpenAI function calling.`,
  },
  {
    id: "draft-3",
    title: "How We Optimized Client Side Bundle Size by 42%",
    platform: "Dev.to",
    date: "2026-09-18",
    status: "Published",
    qualityScore: 91,
    angle: "Lessons Learned",
    text: `We reduced our initial JavaScript bundle size by 42% in GitPulse Studio.\n\nHere is how we did it:\n1. Dynamic imports for heavy analytics charts\n2. Replaced monolithic icons with inline SVG components\n3. Optimized CSS keyframe layers\n\nFull deep dive and benchmarks inside the post! 🧵`,
  },
  {
    id: "draft-4",
    title: "Building Voice & Social Automation for Engineering Teams",
    platform: "Hashnode",
    date: "2026-09-14",
    status: "Draft",
    qualityScore: 89,
    angle: "Developer Story",
    text: `Engineers spend hours summarizing sprint accomplishments for public updates.\n\nWe built GitPulse to parse GitHub commit feeds into authentic platform-tailored developer updates in seconds.\n\nHere is the technical breakdown of our story extraction pipeline...`,
  },
];

export default function HistoryPage() {
  const [draftsList, setDraftsList] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [range, setRange] = useState("30");
  const [copiedId, setCopiedId] = useState(null);
  const [previewDraft, setPreviewDraft] = useState(null);
  const [editText, setEditText] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Load from LocalStorage or fall back to rich sample drafts
  useEffect(() => {
    try {
      const stored = localStorage.getItem("gitpulse_saved_drafts");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDraftsList(parsed);
          return;
        }
      }
    } catch {}

    setDraftsList(SAMPLE_DRAFTS);
  }, []);

  // Save to LocalStorage helper
  const updateDraftsStorage = (newList) => {
    setDraftsList(newList);
    try {
      localStorage.setItem("gitpulse_saved_drafts", JSON.stringify(newList));
    } catch {}
  };

  // Filter drafts based on search query, platform, and timeframe
  const filteredDrafts = useMemo(() => {
    return draftsList.filter((draft) => {
      const matchesQuery =
        draft.title.toLowerCase().includes(query.toLowerCase()) ||
        draft.platform.toLowerCase().includes(query.toLowerCase()) ||
        (draft.text && draft.text.toLowerCase().includes(query.toLowerCase()));

      const matchesPlatform =
        selectedPlatform === "All" ||
        draft.platform.toLowerCase().includes(selectedPlatform.toLowerCase());

      let matchesRange = true;
      if (range !== "all") {
        const draftDate = new Date(draft.date);
        const now = new Date();
        const diffDays = Math.floor((now - draftDate) / (1000 * 60 * 60 * 24));
        matchesRange = diffDays <= Number(range);
      }

      return matchesQuery && matchesPlatform && matchesRange;
    });
  }, [draftsList, query, selectedPlatform, range]);

  // Copy draft content handler
  const handleCopy = async (id, text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  // Delete draft handler
  const confirmDelete = () => {
    if (!deleteTarget) return;
    const updated = draftsList.filter((d) => d.id !== deleteTarget.id);
    updateDraftsStorage(updated);
    if (previewDraft?.id === deleteTarget.id) setPreviewDraft(null);
    setDeleteTarget(null);
  };

  const handleDeleteAll = () => {
    if (!draftsList.length) return;
    const confirmed = window.confirm(
      `Delete all ${draftsList.length} saved drafts? This action cannot be undone.`
    );
    if (!confirmed) return;
    updateDraftsStorage([]);
    setPreviewDraft(null);
    setDeleteTarget(null);
  };

  // Save edit preview handler
  const handleSavePreviewEdit = () => {
    if (!previewDraft) return;
    const updated = draftsList.map((d) =>
      d.id === previewDraft.id ? { ...d, text: editText } : d
    );
    updateDraftsStorage(updated);
    setPreviewDraft(null);
  };

  return (
    <AppShell>
      <div className="w-full max-w-full min-w-0 space-y-5">
        {/* Page Title & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="space-y-1 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Drafts & Stories Archive
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
              Saved Posts & Stories
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Review, edit, copy, or delete your generated developer stories and social updates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-1 sm:pt-0">
            <Link
              href="/dashboard"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 min-h-[42px]"
            >
              <span>+</span> New Story
            </Link>
            <button
              type="button"
              onClick={handleDeleteAll}
              disabled={!draftsList.length}
              title="Delete all saved drafts"
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 transition-all flex items-center gap-1.5 min-h-[42px] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span aria-hidden="true">🗑️</span> Delete all
            </button>
            <div className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900/90 border border-slate-800 text-slate-300 min-h-[42px] flex items-center justify-center">
              {filteredDrafts.length} {filteredDrafts.length === 1 ? "draft" : "drafts"}
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-3 backdrop-blur-xl shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 text-sm">
                🔍
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search drafts by title, platform or text..."
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 min-h-[44px]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Timeframe Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <label className="text-xs text-slate-400 font-medium whitespace-nowrap">Timeframe:</label>
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="w-full sm:w-auto bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 min-h-[44px]"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="all">All time</option>
              </select>
            </div>
          </div>

          {/* Platform Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 w-full no-scrollbar">
            {["All", "LinkedIn", "Twitter", "Dev.to", "Hashnode"].map((p) => {
              const active = selectedPlatform === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPlatform(p)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 border min-h-[38px] ${
                    active
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm"
                      : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {p === "All" ? "🌐 All Platforms" : p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Drafts List Display */}
        {filteredDrafts.length > 0 ? (
          <div>
            {/* Mobile View: Vertical Cards Grid (<768px) */}
            <div className="grid grid-cols-1 gap-3.5 md:hidden w-full">
              {filteredDrafts.map((draft) => (
                <div
                  key={draft.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg hover:border-slate-700 transition-all backdrop-blur-xl w-full min-w-0"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5 min-w-0">
                    <div className="min-w-0 flex-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider mb-1">
                        {draft.platform}
                      </span>
                      <h3 className="text-sm font-bold text-white leading-snug break-words">
                        {draft.title}
                      </h3>
                    </div>
                    {draft.qualityScore && (
                      <span className="px-2 py-1 rounded-lg text-[11px] font-extrabold bg-slate-950 text-emerald-400 border border-slate-800 shrink-0">
                        {draft.qualityScore}%
                      </span>
                    )}
                  </div>

                  {/* Draft Text Preview */}
                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed font-sans bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 break-words">
                    {draft.text}
                  </p>

                  {/* Card Metadata & Action Buttons */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono">{draft.date}</span>
                      <span className="text-emerald-400 font-semibold">{draft.status || "Saved"}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          setPreviewDraft(draft);
                          setEditText(draft.text || "");
                        }}
                        className="px-2 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center gap-1 min-h-[42px]"
                      >
                        <span>👁️</span> Preview
                      </button>
                      <button
                        onClick={() => handleCopy(draft.id, draft.text)}
                        className={`px-2 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1 min-h-[42px] ${
                          copiedId === draft.id
                            ? "bg-emerald-500 text-slate-950 font-bold"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                        }`}
                      >
                        <span>{copiedId === draft.id ? "✓" : "📋"}</span>
                        <span>{copiedId === draft.id ? "Copied" : "Copy"}</span>
                      </button>
                      <button
                        onClick={() => setDeleteTarget(draft)}
                        className="px-2 py-2.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 transition flex items-center justify-center gap-1 min-h-[42px]"
                      >
                        <span>🗑️</span> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Structured Table (≥768px) */}
            <div className="hidden md:block bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-4">Story Title & Content Preview</th>
                    <th className="py-3.5 px-4">Platform</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Quality</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredDrafts.map((draft) => (
                    <tr key={draft.id} className="hover:bg-slate-800/40 transition-colors group">
                      <td className="py-3.5 px-4 max-w-md">
                        <div className="font-bold text-white text-sm truncate">{draft.title}</div>
                        <div className="text-slate-400 line-clamp-1 mt-0.5 font-sans">
                          {draft.text}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-950 text-emerald-300 border border-slate-800">
                          {draft.platform}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono">
                        {draft.date}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {draft.qualityScore || 90}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setPreviewDraft(draft);
                              setEditText(draft.text || "");
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => handleCopy(draft.id, draft.text)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              copiedId === draft.id
                                ? "bg-emerald-500 text-slate-950 font-bold"
                                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                            }`}
                          >
                            {copiedId === draft.id ? "Copied! ✓" : "Copy"}
                          </button>
                          <button
                            onClick={() => setDeleteTarget(draft)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 transition flex items-center gap-1"
                          >
                            <span>🗑️</span> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center text-2xl mx-auto border border-slate-700">
              📂
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No drafts match your search</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                Try clearing your search query or adjusting the platform filter to display saved stories.
              </p>
            </div>
            <button
              onClick={() => {
                setQuery("");
                setSelectedPlatform("All");
                setRange("all");
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div
              className="bg-slate-900 border border-rose-500/30 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-lg font-bold border border-rose-500/30 shrink-0">
                  ⚠️
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Delete Draft?</h3>
                  <p className="text-xs text-slate-400 mt-0.5">This item will be removed from your archive.</p>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-slate-200 line-clamp-1">{deleteTarget.title}</div>
                <div className="text-[11px] text-emerald-400 font-mono">{deleteTarget.platform} • {deleteTarget.date}</div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition min-h-[40px]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition shadow-lg shadow-rose-600/30 min-h-[40px]"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Draft Preview & Edit Modal */}
        {previewDraft && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                <div className="min-w-0 pr-4">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {previewDraft.platform} Draft
                  </span>
                  <h3 className="text-base font-bold text-white truncate mt-1">
                    {previewDraft.title}
                  </h3>
                </div>
                <button
                  onClick={() => setPreviewDraft(null)}
                  className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition shrink-0"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
                <label className="text-xs font-semibold text-slate-300 block">
                  Post Content (Editable)
                </label>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={10}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 resize-y leading-relaxed font-sans"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{editText.length} characters</span>
                  <span>Persistent in local archive</span>
                </div>
              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleCopy(previewDraft.id, editText)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition flex items-center gap-1.5 min-h-[40px]"
                >
                  <span>{copiedId === previewDraft.id ? "Copied! ✓" : "Copy Content"}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewDraft(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition min-h-[40px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePreviewEdit}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/20 min-h-[40px]"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
