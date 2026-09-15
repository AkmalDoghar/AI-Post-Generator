"use client";

import AppShell from "../../components/AppShell";

const stats = [
  { label: "Draft reach", value: "18.4k", change: "+24%" },
  { label: "Engagement", value: "6.1%", change: "+1.8%" },
  { label: "Avg. saves", value: "843", change: "+12%" },
  { label: "Conversion", value: "3.2%", change: "+0.7%" },
];

const chartBars = [56, 72, 68, 86, 79, 94, 110, 101, 120, 132, 118, 141];

export default function AnalyticsPage() {
  function exportReport() {
    const rows = [["Metric", "Value", "Change"], ...stats.map((item) => [item.label, item.value, item.change])];
    const blob = new Blob([rows.map((row) => row.join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "gitpulse-analytics.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell>
      <div className="studio-page">
        <div className="studio-heading">
          <div>
            <div className="studio-kicker"><span /> Performance signal</div>
            <h2 className="studio-title">See what is resonating.</h2>
            <p className="studio-subtitle">A simple read on the stories you put into the world.</p>
          </div>
          <button onClick={exportReport} className="studio-action">
            Export report
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="analytics-stat">
              <div className="studio-card-label">{item.label}</div>
              <div className="analytics-stat-row">
                <div>{item.value}</div>
                <span>
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="analytics-panel">
            <div className="analytics-panel-heading">
              <div>
                <div className="studio-card-label">Growth</div>
                <div className="analytics-panel-title">Reach trend</div>
              </div>
              <div className="analytics-trend-note">
                <div>Last 12 weeks</div>
                <div className="text-emerald-300">+38.2%</div>
              </div>
            </div>

            <div className="analytics-chart">
              {chartBars.map((height, index) => (
                <div key={index} className="analytics-bar" style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>

          <div className="analytics-panel">
            <div className="studio-card-label">Top posts</div>
            <div className="analytics-posts">
              {[
                ["LinkedIn", "4.8k views", "14 shares"],
                ["Instagram", "3.7k reach", "28 saves"],
                ["Facebook", "2.1k reach", "8 reactions"],
              ].map(([platform, reach, actions]) => (
                <div key={platform} className="analytics-post">
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
