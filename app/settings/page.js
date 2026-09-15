"use client";

import { useEffect, useState } from "react";
import AppShell from "../../components/AppShell";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [githubUsername, setGithubUsername] = useState("");
  const [platform, setPlatform] = useState("LinkedIn");
  const [cadence, setCadence] = useState("Weekly");
  const [saved, setSaved] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setUser(data?.user || null))
      .catch(() => {});
    fetch("/api/github-connection")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.connected) {
          setGithubConnected(true);
          setGithubUsername(data.username);
        }
      })
      .catch(() => {});
  }, []);

  function saveSettings(event) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  async function disconnectGitHub() {
    await fetch("/api/github-connection", { method: "DELETE" });
    setGithubConnected(false);
    setGithubUsername("");
  }

  return (
    <AppShell>
      <div className="studio-page">
        <div className="studio-heading">
          <div>
            <div className="studio-kicker"><span /> Workspace control</div>
            <h2 className="studio-title">Make GitPulse yours.</h2>
            <p className="studio-subtitle">Tune your source, voice, and publishing preferences.</p>
          </div>
          {saved && <div className="settings-saved">Changes saved</div>}
        </div>

        <div className="settings-layout">
          <form className="settings-panel" onSubmit={saveSettings}>
            <div className="settings-panel-heading"><span className="settings-number">01</span><div><h3>Workspace preferences</h3><p>These defaults shape every new draft.</p></div></div>
            <label className="settings-field">GitHub username<input value={githubUsername} onChange={(event) => setGithubUsername(event.target.value)} placeholder="your-github-handle" /></label>
            {githubConnected && <button type="button" className="settings-disconnect" onClick={disconnectGitHub}>Disconnect GitHub</button>}
            <label className="settings-field">Default platform<select value={platform} onChange={(event) => setPlatform(event.target.value)}><option>LinkedIn</option><option>Instagram</option><option>Facebook</option></select></label>
            <label className="settings-field">Posting cadence<select value={cadence} onChange={(event) => setCadence(event.target.value)}><option>Weekly</option><option>Twice a week</option><option>Monthly</option><option>Whenever I ship</option></select></label>
            <button className="settings-save" type="submit">Save preferences</button>
          </form>

          <div className="settings-side">
            <section className="settings-profile"><div className="settings-avatar">{user?.name?.slice(0, 1).toUpperCase() || "W"}</div><div><span className="studio-card-label">Signed in as</span><strong>{user?.name || "Workspace member"}</strong><small>{user?.email || "Loading account..."}</small></div></section>
            <section className="settings-panel settings-integrations"><div className="settings-panel-heading"><span className="settings-number">02</span><div><h3>Connections</h3><p>Services powering your workspace.</p></div></div>{[["GitHub", "Activity source", githubConnected ? "Connected" : "Not connected"], ["GitPulse AI", "Draft generation", "Ready"], ["Publishing", "Manual review", "On"]].map(([name, detail, status]) => <div className="settings-connection" key={name}><div><strong>{name}</strong><small>{detail}</small></div><span className={name === "GitHub" && !githubConnected ? "settings-status-muted" : ""}>{status}</span></div>)}</section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
