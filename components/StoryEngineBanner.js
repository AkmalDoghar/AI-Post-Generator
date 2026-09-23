"use client";

import { useState } from "react";

export default function StoryEngineBanner({ storyAnalysis, onOpenEvidence }) {
  if (!storyAnalysis) return null;

  const {
    headline,
    narrative,
    suggestedAngleLabel,
    suggestedAngleIcon,
    confidence,
    evidenceList = [],
    breakdown = {},
  } = storyAnalysis;

  return (
    <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold border border-emerald-500/40">
            ✦
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                GitPulse Story Engine
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Confidence: {confidence}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
              {headline}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Suggested Angle:</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 text-emerald-300 border border-slate-700">
            <span>{suggestedAngleIcon}</span>
            <span>{suggestedAngleLabel}</span>
          </span>
        </div>
      </div>

      <p className="text-sm text-slate-300 leading-relaxed mb-4">
        {narrative}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap gap-2 text-xs text-slate-400">
          <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">
            ⚡ {breakdown.features || 0} Features
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">
            🐛 {breakdown.fixes || 0} Bug fixes
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">
            🔧 {breakdown.refactor || 0} Refactors
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">
            📂 {breakdown.newRepos || 0} New repos
          </span>
        </div>

        <button
          onClick={onOpenEvidence}
          className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-950/60 hover:bg-emerald-900/60 px-3.5 py-1.5 rounded-lg border border-emerald-500/30"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Inspect Evidence ({evidenceList.length} sources)
        </button>
      </div>
    </div>
  );
}
