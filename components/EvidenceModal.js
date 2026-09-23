"use client";

export default function EvidenceModal({ isOpen, onClose, storyAnalysis, summary }) {
  if (!isOpen || !storyAnalysis) return null;

  const { evidenceList = [], headline, narrative } = storyAnalysis;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <h3 className="text-base font-bold text-white">
                Fact Evidence Tracing
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified GitHub sources backing claims in your generated draft.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              Detected Story Context
            </h4>
            <p className="text-sm font-medium text-white mb-1">{headline}</p>
            <p className="text-xs text-slate-300 leading-relaxed">{narrative}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Recorded Activity Evidence ({evidenceList.length})
            </h4>

            {evidenceList.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-emerald-300 border border-slate-700">
                      {item.type}
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {item.repo}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">
                    {item.headline}
                  </p>
                  <p className="text-[11px] text-slate-500">{item.details}</p>
                </div>

                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline shrink-0"
                  >
                    View Source ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-emerald-400">✓</span> No fabricated numbers or claims
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Close Evidence
          </button>
        </div>
      </div>
    </div>
  );
}
