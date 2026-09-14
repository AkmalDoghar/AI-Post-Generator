import AppShell from "../../components/AppShell";

const stats = [
  { label: "Draft reach", value: "18.4k", change: "+24%" },
  { label: "Engagement", value: "6.1%", change: "+1.8%" },
  { label: "Avg. saves", value: "843", change: "+12%" },
  { label: "Conversion", value: "3.2%", change: "+0.7%" },
];

const chartBars = [56, 72, 68, 86, 79, 94, 110, 101, 120, 132, 118, 141];

export default function AnalyticsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker">Analytics</p>
            <h2 className="page-title mt-2">Performance overview</h2>
          </div>
          <button className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-cyan-200">
            Export report
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="metric-card p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</div>
              <div className="mt-4 flex items-end justify-between">
                <div className="text-3xl font-bold text-white">{item.value}</div>
                <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-300">
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="glass-panel rounded-3xl p-5">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Growth</div>
                <div className="mt-1 text-xl font-semibold text-white">Reach trend</div>
              </div>
              <div className="text-right text-sm text-slate-400">
                <div>Last 12 weeks</div>
                <div className="text-emerald-300">+38.2%</div>
              </div>
            </div>

            <div className="flex h-56 items-end gap-2 rounded-2xl bg-slate-950/50 p-3">
              {chartBars.map((height, index) => (
                <div key={index} className="flex-1 rounded-t-xl bg-gradient-to-t from-cyan-500 to-emerald-400" style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Top posts</div>
            <div className="mt-5 space-y-4">
              {[
                ["LinkedIn", "4.8k views", "14 shares"],
                ["Instagram", "3.7k reach", "28 saves"],
                ["Twitter/X", "2.1k impressions", "8 reposts"],
              ].map(([platform, reach, actions]) => (
                <div key={platform} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/80 p-3">
                  <div>
                    <div className="font-medium text-white">{platform}</div>
                    <div className="text-sm text-slate-400">{reach}</div>
                  </div>
                  <div className="text-xs text-cyan-300">{actions}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
