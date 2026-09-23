"use client";

import { STORY_ANGLES } from "../lib/storyAnalyzer";

export default function AngleSelector({ selectedAngle, onSelectAngle }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          03. Choose your story angle
        </label>
        <span className="text-xs text-slate-500">
          Tailors the narrative focus of your draft
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {STORY_ANGLES.map((angle) => {
          const isSelected = selectedAngle === angle.id;
          return (
            <button
              key={angle.id}
              type="button"
              onClick={() => onSelectAngle(angle.id)}
              className={`flex flex-col text-left p-3 rounded-xl border transition-all relative overflow-hidden group ${
                isSelected
                  ? "bg-emerald-950/50 border-emerald-500/70 text-white shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/50"
                  : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{angle.icon}</span>
                <span className="text-xs font-bold truncate">
                  {angle.label}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                {angle.description}
              </p>

              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
