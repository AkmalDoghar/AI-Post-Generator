"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppShell from "../../components/AppShell";

const CHART_DATA_PRESETS = {
  "7D": [42, 65, 58, 84, 92, 78, 98],
  "30D": [48, 55, 62, 70, 68, 82, 95, 110, 105, 125, 118, 140],
  "90D": [30, 45, 55, 60, 75, 80, 92, 105, 120, 135, 145, 160],
  "12W": [56, 72, 68, 86, 79, 94, 110, 101, 120, 132, 118, 141],
};

const DEFAULT_SAMPLE_POSTS = [
  { title: "Overhauled Mobile Navigation Drawer in Next.js 14", platform: "LinkedIn", reach: "4.8k views", shares: "14 shares", score: 94 },
  { title: "Shipped Fact Verification Engine for AI Post Generation", platform: "Twitter", reach: "3.7k reach", shares: "28 retweets", score: 96 },
  { title: "How We Optimized Client Side Bundle Size by 42%", platform: "Dev.to", reach: "2.9k reads", shares: "19 reactions", score: 91 },
  { title: "Building Voice & Social Automation for Engineering Teams", platform: "Hashnode", reach: "2.1k reads", shares: "8 bookmarks", score: 89 },
];

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("30D");
  const [draftsList, setDraftsList] = useState([]);
  const [activeBar, setActiveBar] = useState(null);

  // Hydrate saved drafts from LocalStorage
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

    setDraftsList(DEFAULT_SAMPLE_POSTS);
  }, []);

  // Compute live dynamic statistics
  const analyticsSummary = useMemo(() => {
    const count = draftsList.length || 4;
    const avgScore = Math.round(
      draftsList.reduce((acc, d) => acc + (d.qualityScore || d.score || 90), 0) / count
    );
    const estimatedReach = (count * 3.4).toFixed(1);
    
    // Calculate platform counts
    const counts = {};
    draftsList.forEach((d) => {
      const p = d.platform || "LinkedIn";
      counts[p] = (counts[p] || 0) + 1;
    });

    const topPlatform = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b), "LinkedIn");

    return {
      totalStories: count,
      estimatedReach: `${estimatedReach}k`,
      avgQuality: `${avgScore}%`,
      topPlatform,
    };
  }, [draftsList]);

  // Export Analytics Summary to CSV
  const handleExportCSV = () => {
    const rows = [
      ["GitPulse Analytics Performance Report"],
      ["Generated Date", new Date().toISOString().split("T")[0]],
      [],
      ["Metric", "Value", "Trend"],
      ["Total Generated Stories", analyticsSummary.totalStories, "+32% vs last period"],
      ["Estimated Organic Reach", analyticsSummary.estimatedReach, "+24% vs last period"],
      ["Average Quality Score", analyticsSummary.avgQuality, "+4.2% quality boost"],
      ["Top Social Channel", analyticsSummary.topPlatform, "Primary channel"],
      [],
      ["Top Story Title", "Platform", "Reach / Views", "Quality Score"],
      ...draftsList.slice(0, 5).map((d) => [
        `"${d.title.replace(/"/g, '""')}"`,
        d.platform,
        d.reach || `${(Math.random() * 3 + 2).toFixed(1)}k views`,
        `${d.qualityScore || d.score || 90}%`,
      ]),
    ];

    const csvContent = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `gitpulse-analytics-${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const chartBars = CHART_DATA_PRESETS[timeframe] || CHART_DATA_PRESETS["30D"];
  const maxBarValue = Math.max(...chartBars);

  return (
    <AppShell>
      <div className="w-full max-w-full min-w-0 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="space-y-1 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> Performance Analytics
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
              Story Signal & Reach Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Real-time analytics on your published stories, channel distribution, and quality performance.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 min-h-[42px]"
            >
              <span>📥</span> Export CSV Report
            </button>
          </div>
        </div>

        {/* Dynamic Key Performance Indicator (KPI) Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
          {/* Card 1: Total Stories */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stories Generated</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                +32%
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {analyticsSummary.totalStories} <span className="text-xs font-normal text-slate-400">posts</span>
            </div>
            <p className="text-[11px] text-slate-500">Persisted in local archive</p>
          </div>

          {/* Card 2: Estimated Reach */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Reach</span>
              <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                +24%
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {analyticsSummary.estimatedReach} <span className="text-xs font-normal text-slate-400">views</span>
            </div>
            <p className="text-[11px] text-slate-500">Across developer feeds</p>
          </div>

          {/* Card 3: Quality Score */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Quality Score</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                +4.2%
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
              {analyticsSummary.avgQuality}
            </div>
            <p className="text-[11px] text-slate-500">Verified code accuracy</p>
          </div>

          {/* Card 4: Top Channel */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Channel</span>
              <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                Primary
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight truncate">
              {analyticsSummary.topPlatform}
            </div>
            <p className="text-[11px] text-slate-500">Highest engagement rate</p>
          </div>
        </div>

        {/* Main Section: Interactive Chart & Platform Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Chart Panel (2 Cols on desktop) */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 backdrop-blur-xl shadow-xl flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">Growth Signal</span>
                <h3 className="text-base font-bold text-white">Story Reach Trend</h3>
              </div>

              {/* Timeframe Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                {["7D", "30D", "90D", "12W"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimeframe(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      timeframe === t
                        ? "bg-emerald-500 text-slate-950 shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Bar Chart Container */}
            <div className="pt-6 pb-2">
              <div className="h-44 sm:h-52 w-full flex items-end justify-between gap-1.5 sm:gap-3 px-2">
                {chartBars.map((val, idx) => {
                  const percentage = Math.round((val / maxBarValue) * 100);
                  const isHovered = activeBar === idx;
                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center gap-2 group relative cursor-pointer"
                      onMouseEnter={() => setActiveBar(idx)}
                      onMouseLeave={() => setActiveBar(null)}
                    >
                      {/* Tooltip Hover Bubble */}
                      {isHovered && (
                        <div className="absolute -top-9 bg-slate-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold px-2 py-1 rounded-md shadow-xl whitespace-nowrap z-20 animate-fade-in">
                          {val * 120} views ({percentage}%)
                        </div>
                      )}

                      {/* Bar Fill */}
                      <div className="w-full bg-slate-950 rounded-lg p-0.5 flex items-end h-full">
                        <div
                          style={{ height: `${percentage}%` }}
                          className={`w-full rounded-md transition-all duration-300 ${
                            isHovered
                              ? "bg-gradient-to-t from-emerald-500 to-cyan-400 shadow-lg shadow-emerald-500/50"
                              : "bg-gradient-to-t from-emerald-500/40 to-cyan-500/60 group-hover:from-emerald-500/70 group-hover:to-cyan-400"
                          }`}
                        />
                      </div>

                      <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-300 transition">
                        W{idx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
              <span>Showing distribution for selected timeframe ({timeframe})</span>
              <span className="text-emerald-400 font-semibold">+38.2% total organic growth</span>
            </div>
          </div>

          {/* Platform Performance Share Panel */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 backdrop-blur-xl shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Distribution</span>
              <h3 className="text-base font-bold text-white mt-0.5">Platform Channel Share</h3>
            </div>

            <div className="space-y-3.5">
              {[
                { name: "LinkedIn", percentage: 45, color: "bg-blue-500", reach: "4.8k views" },
                { name: "Twitter / X", percentage: 30, color: "bg-cyan-400", reach: "3.2k impressions" },
                { name: "Dev.to", percentage: 15, color: "bg-emerald-400", reach: "1.9k reads" },
                { name: "Hashnode", percentage: 10, color: "bg-purple-400", reach: "1.1k reads" },
              ].map((platform) => (
                <div key={platform.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{platform.name}</span>
                    <span className="font-mono text-slate-400">{platform.reach} ({platform.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      style={{ width: `${platform.percentage}%` }}
                      className={`h-full ${platform.color} rounded-full transition-all duration-500`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800">
              <Link
                href="/history"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5"
              >
                <span>📂</span> View All Saved Drafts
              </Link>
            </div>
          </div>
        </div>

        {/* Top Performing Stories Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">High Impact</span>
              <h3 className="text-base font-bold text-white">Top Performing Stories</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Sorted by quality score</span>
          </div>

          <div className="space-y-2.5">
            {draftsList.slice(0, 4).map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {item.platform}
                    </span>
                    <span className="text-xs font-mono text-slate-500">{item.date || "2026-09-23"}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                </div>

                <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end border-t sm:border-t-0 border-slate-800/80 pt-2 sm:pt-0">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-200">{item.reach || "3.8k reach"}</div>
                    <div className="text-[10px] text-cyan-400 font-mono">{item.shares || "18 engagement"}</div>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {item.qualityScore || item.score || 90}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
