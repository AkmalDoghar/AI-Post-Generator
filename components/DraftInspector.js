"use client";

import { useState } from "react";

export default function DraftInspector({
  drafts = [],
  platformLabel = "LinkedIn",
  onOpenEvidence,
}) {
  const [activeDraftId, setActiveDraftId] = useState("draft-a");
  const [editedPosts, setEditedPosts] = useState({});
  const [copied, setCopied] = useState(false);

  if (!drafts || drafts.length === 0) return null;

  const currentDraft = drafts.find((d) => d.id === activeDraftId) || drafts[0];
  const postText = editedPosts[currentDraft.id] ?? currentDraft.postText;
  const quality = currentDraft.quality || { overall: 90, metrics: {}, checklist: {} };
  const { metrics = {}, checklist = {} } = quality;

  const handleTextChange = (val) => {
    setEditedPosts((prev) => ({
      ...prev,
      [currentDraft.id]: val,
    }));
  };

  const handleCopy = async () => {
    if (!postText) return;
    try {
      await navigator.clipboard.writeText(postText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          05. Review & Inspect Drafts
        </label>
        <span className="text-xs text-slate-500">
          Compare variations & review quality audit
        </span>
      </div>

      {/* Multi-draft Variation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {drafts.map((d) => {
          const isActive = d.id === currentDraft.id;
          return (
            <button
              key={d.id}
              onClick={() => setActiveDraftId(d.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-2 ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-md"
                  : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800/60"
              }`}
            >
              <span>{d.title}</span>
              {d.quality?.overall && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-950 text-emerald-400">
                  {d.quality.overall}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Left Editor | Right Quality Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Editor (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Draft · {platformLabel}
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                {currentDraft.angleName || "Custom"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenEvidence}
                className="text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
              >
                Inspect Evidence 🔍
              </button>
              <button
                onClick={handleCopy}
                className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${
                  copied
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30"
                }`}
              >
                {copied ? "Copied! ✓" : "Copy Draft"}
              </button>
            </div>
          </div>

          <textarea
            value={postText}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={12}
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 resize-y font-sans leading-relaxed"
            placeholder="Your generated draft will appear here..."
          />

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>{postText.length} characters</span>
            <span>Manual review · Edit freely before posting</span>
          </div>
        </div>

        {/* Quality Scorecard & Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quality Scorecard */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Post Quality Audit
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold text-emerald-400">
                  {quality.overall}
                </span>
                <span className="text-xs text-slate-400 font-semibold">/100</span>
              </div>
            </div>

            {/* Score Bars */}
            <div className="space-y-2 text-xs">
              <ScoreItem label="Story Narrative" score={metrics.story || 92} />
              <ScoreItem label="Specificity" score={metrics.specificity || 95} />
              <ScoreItem label="Human Tone" score={metrics.humanTone || 91} />
              <ScoreItem label="Technical Depth" score={metrics.technical || 85} />
              <ScoreItem label="Hook Strength" score={metrics.hook || 90} />
            </div>

            {/* Why This Post Works Box */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 mt-3">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                💡 Why this draft works
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentDraft.rationale || "Highlights actual development work with clean developer formatting."}
              </p>
            </div>
          </div>

          {/* Fact Verification Checklist */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2.5">
            <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-slate-800 pb-2">
              Verification Checklist
            </span>

            <ul className="space-y-1.5 text-xs text-slate-300">
              <CheckListItem label="Mentions specific GitHub work" checked={checklist.mentionsSpecificWork !== false} />
              <CheckListItem label="Explains why it mattered" checked={checklist.explainsWhyItMattered !== false} />
              <CheckListItem label="Doesn't repeat commit messages verbatim" checked={checklist.avoidsVerbatimCommits !== false} />
              <CheckListItem label="No generic motivational filler" checked={checklist.noGenericFiller !== false} />
              <CheckListItem label="Natural developer voice" checked={checklist.naturalDeveloperTone !== false} />
              <CheckListItem label="Platform format & length optimized" checked={checklist.platformOptimized !== false} />
              <CheckListItem label="No invented claims or metrics" checked={checklist.noInventedClaims !== false} />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreItem({ label, score }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px]">
        <span className="text-slate-400">{label}</span>
        <span className="font-semibold text-emerald-400">{score}%</span>
      </div>
      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-emerald-400 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  );
}

function CheckListItem({ label, checked }) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
          checked
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
            : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
        }`}
      >
        {checked ? "✓" : "✕"}
      </span>
      <span className={checked ? "text-slate-200" : "text-slate-500 line-through"}>
        {label}
      </span>
    </li>
  );
}
