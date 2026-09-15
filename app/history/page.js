"use client";

import { useMemo, useState } from "react";
import AppShell from "../../components/AppShell";

const drafts = [];

export default function HistoryPage() {
  const [query, setQuery] = useState("");
  const [range, setRange] = useState("7");
  const filteredDrafts = useMemo(() => drafts.filter((draft) => {
    const matchesQuery = draft.title.toLowerCase().includes(query.toLowerCase()) || draft.platform.toLowerCase().includes(query.toLowerCase());
    const age = Math.floor((new Date("2026-09-15") - new Date(draft.date)) / 86400000);
    return matchesQuery && age <= Number(range);
  }), [query, range]);

  return (
    <AppShell>
      <div className="studio-page">
        <div className="studio-heading">
          <div>
            <div className="studio-kicker"><span /> Content archive</div>
            <h2 className="studio-title">Your stories, in one place.</h2>
            <p className="studio-subtitle">Review what you have shaped, saved, and shared.</p>
          </div>
          <div className="studio-count">{filteredDrafts.length} published posts</div>
        </div>

        <div className="archive-toolbar">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search published posts" />
          <div className="archive-filters">{[["7", "Last 7 days"], ["30", "Last 30 days"]].map(([value, label]) => <button key={value} onClick={() => setRange(value)} className={range === value ? "archive-filter-active" : ""}>{label}</button>)}</div>
        </div>

        <div className="archive-list">
          <div className="archive-list-header"><span>Published post</span><span>Platform</span><span>Date</span><span>Status</span></div>

          {filteredDrafts.map((draft) => (
            <div key={draft.title} className="archive-row">
              <div><strong>{draft.title}</strong><small>Published story</small></div>
              <div className="archive-platform">{draft.platform}</div>
              <div className="archive-date">{new Date(`${draft.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
              <div><span className={`archive-status archive-status-${draft.status.toLowerCase()}`}>{draft.status}</span></div>
            </div>
          ))}
          {!filteredDrafts.length && <div className="archive-empty">No drafts match this filter.</div>}
        </div>
        <div className="archive-footer">Showing published posts from the selected time window.</div>
      </div>
    </AppShell>
  );
}
