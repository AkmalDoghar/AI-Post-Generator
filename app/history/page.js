import AppShell from "../../components/AppShell";

const drafts = [
  { title: "Weekly product update", platform: "LinkedIn", date: "Jun 12, 2026", status: "Published" },
  { title: "Shipping momentum", platform: "Instagram", date: "Jun 09, 2026", status: "Draft" },
  { title: "Debugging wins", platform: "Twitter / X", date: "Jun 04, 2026", status: "Scheduled" },
  { title: "Week in code", platform: "Facebook", date: "May 30, 2026", status: "Published" },
];

export default function HistoryPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="section-kicker">Drafts</p>
            <h2 className="page-title mt-2">Recent generation history</h2>
          </div>
          <button className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-slate-200">
            Filter
          </button>
        </div>

        <div className="glass-panel overflow-hidden rounded-3xl">
          <div className="grid grid-cols-[1.5fr_0.9fr_0.7fr_0.8fr] border-b border-white/10 px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-slate-400">
            <div>Draft</div>
            <div>Platform</div>
            <div>Date</div>
            <div>Status</div>
          </div>

          {drafts.map((draft) => (
            <div key={draft.title} className="grid grid-cols-[1.5fr_0.9fr_0.7fr_0.8fr] items-center border-b border-white/10 px-4 py-4 text-sm last:border-b-0">
              <div className="font-medium text-white">{draft.title}</div>
              <div className="text-slate-300">{draft.platform}</div>
              <div className="text-slate-400">{draft.date}</div>
              <div>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
                  {draft.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
