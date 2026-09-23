"use client";

import { useState } from "react";

export default function WeeklyRecapModal({ isOpen, onClose, summary, storyAnalysis }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !summary) return null;

  const commitCount = summary.commitCount || 0;
  const reposCount = summary.reposTouched?.length || 1;
  const languages = summary.topLanguages?.join(", ") || "JavaScript & CSS";
  const headline = storyAnalysis?.headline || "Steady shipping & momentum";
  const repoLinks = (summary.reposTouched || []).map((r) => `https://github.com/${r}`).join("\n");

  const weeklyPostText = `📦 YOUR WEEK IN CODE · GitPulse Weekly Story

Activity Summary:
• ${commitCount} commits shipped across ${reposCount} repo(s)
• Stack focus: ${languages}
• Key story: ${headline}

Major highlights:
${(summary.commits || []).slice(0, 4).map((c) => `→ ${c.message.split("\n")[0]}`).join("\n")}

Reflections from the week:
Consistent shipping adds up faster than sporadic long sessions. Small daily iterations keep the product moving forward cleanly.

Still building in public. 🚀

${repoLinks ? `\nExplore the repositories:\n${repoLinks}\n` : ""}
#BuildInPublic #WeeklyRecap #SoftwareEngineering #WebDevelopment`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(weeklyPostText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📊</span>
            <div>
              <h3 className="text-base font-bold text-white">
                GitPulse Weekly Story
              </h3>
              <p className="text-xs text-slate-400">
                Consolidated 7-day developer story recap for LinkedIn & X
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Commits</span>
              <span className="text-xl font-bold text-emerald-400">+{commitCount}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Repos</span>
              <span className="text-xl font-bold text-emerald-400">{reposCount}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">PRs</span>
              <span className="text-xl font-bold text-emerald-400">+{summary.pullRequests?.length || 0}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Generated Weekly Recap Post
            </label>
            <textarea
              readOnly
              value={weeklyPostText}
              rows={9}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 font-sans leading-relaxed focus:outline-none"
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors"
          >
            {copied ? "Copied! ✓" : "Copy Weekly Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
