"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../../components/AppShell";

export default function SettingsPage() {
  const router = useRouter();
  const [appOrigin, setAppOrigin] = useState("");
  const [user, setUser] = useState(null);

  // Profile Edit States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Workspace States
  const [githubUsername, setGithubUsername] = useState("");
  const [platform, setPlatform] = useState("LinkedIn");
  const [cadence, setCadence] = useState("Weekly");
  const [saved, setSaved] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);

  const [linkedinStatus, setLinkedinStatus] = useState({
    connected: false,
    personUrn: "",
    profileName: "",
    loading: true,
  });

  const [notification, setNotification] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    setAppOrigin(window.location.origin);

    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          setName(data.user.name || "");
          setEmail(data.user.email || "");
          setBio(data.user.bio || "");
          setAvatarUrl(data.user.avatarUrl || "");
          setTimezone(data.user.timezone || "UTC");
        }
      })
      .catch(() => {});

    fetch("/api/github-connection")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.connected) {
          setGithubConnected(true);
          setGithubUsername(data.username);
        }
      })
      .catch(() => {});

    fetchLinkedinStatus();

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("linkedin") === "success") {
        const profileName = params.get("name") || "";
        setNotification(`LinkedIn connected successfully! ${profileName ? `(${profileName})` : ""}`);
      } else if (params.get("linkedin_error")) {
        setNotification(`LinkedIn Connection Error: ${params.get("linkedin_error")}`);
      }
    }
  }, []);

  const fetchLinkedinStatus = async () => {
    try {
      const res = await fetch("/api/auth/linkedin/status");
      if (res.ok) {
        const data = await res.json();
        setLinkedinStatus({
          connected: data.connected,
          personUrn: data.personUrn || "",
          profileName: data.profileName || "",
          loading: false,
        });
      }
    } catch {
      setLinkedinStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  async function handleSaveProfile(event) {
    event.preventDefault();
    if (savingProfile) return;
    setSavingProfile(true);
    setProfileError("");
    setProfileSaved(false);

    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, bio, timezone, avatarUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setUser(data.user);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
      window.location.reload(); // Refresh header user state
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setSavingProfile(false);
    }
  }

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

  async function handleDeleteAccount() {
    if (deletingAccount) return;

    const confirmed = window.confirm(
      "Delete your GitPulse account permanently? This will remove your profile, settings, and password reset data. This action cannot be undone."
    );
    if (!confirmed) return;

    setDeletingAccount(true);
    setDeleteError("");

    try {
      const response = await fetch("/api/auth/me", { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to delete your account.");
      router.replace("/login");
      router.refresh();
    } catch (error) {
      setDeleteError(error.message || "Unable to delete your account.");
      setDeletingAccount(false);
    }
  }

  const handleConnectLinkedin = () => {
    window.location.href = "/api/auth/linkedin";
  };

  return (
    <AppShell>
      <div className="settings-page studio-page max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="settings-heading studio-heading flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="studio-kicker text-emerald-400 font-semibold text-xs flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Workspace Control
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Make GitPulse yours.</h2>
            <p className="text-xs text-slate-400">Manage your profile, GitHub source, and LinkedIn authorization.</p>
          </div>
          {saved && <div className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">Preferences saved ✓</div>}
        </div>

        {notification && (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between">
            <span>{notification}</span>
            <button onClick={() => setNotification("")} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        <div className="settings-grid grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Profile Edit & Workspace Preferences */}
          <div className="settings-main-column lg:col-span-7 space-y-6">
            {/* 01 Profile Information Form */}
            <form className="settings-panel bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4" onSubmit={handleSaveProfile}>
              <div className="settings-panel-heading flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-extrabold text-xs flex items-center justify-center border border-emerald-500/40">
                    01
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">Profile Information</h3>
                    <p className="text-xs text-slate-400">Edit your personal account details</p>
                  </div>
                </div>
                {profileSaved && <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">Profile updated ✓</span>}
              </div>

              {profileError && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-200">
                  {profileError}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Profile Picture (Avatar URL)</label>
                  <div className="settings-avatar-field flex gap-2 items-center">
                    <input
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                    />
                    {githubUsername && (
                      <button
                        type="button"
                        onClick={() => setAvatarUrl(`https://github.com/${githubUsername}.png`)}
                        className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-[11px] font-medium px-2.5 py-2 rounded-xl transition-all whitespace-nowrap"
                        title="Use your connected GitHub profile picture"
                      >
                        Use GitHub Avatar
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ada Lovelace"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Bio / Headline</label>
                  <input
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Full-Stack Developer building GitPulse in public..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="Asia/Karachi">Asia/Karachi (PKT +05:00)</option>
                    <option value="America/New_York">America/New_York (EST -05:00)</option>
                    <option value="Europe/London">Europe/London (GMT +00:00)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (JST +09:00)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md shadow-emerald-500/20"
                >
                  {savingProfile ? "Saving profile..." : "Save Profile Changes"}
                </button>
              </div>
            </form>

            {/* 02 Workspace Preferences */}
            <form className="settings-panel bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4" onSubmit={saveSettings}>
              <div className="settings-panel-heading flex items-center gap-3 border-b border-slate-800 pb-3">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-extrabold text-xs flex items-center justify-center border border-emerald-500/40">
                  02
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">Workspace Preferences</h3>
                  <p className="text-xs text-slate-400">Defaults shaping every new draft</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">GitHub Username</label>
                  <input
                    value={githubUsername}
                    onChange={(event) => setGithubUsername(event.target.value)}
                    placeholder="your-github-handle"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                  />
                  {githubConnected && (
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        GitHub Connected
                      </span>
                      <button
                        type="button"
                        className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors"
                        onClick={disconnectGitHub}
                      >
                        Disconnect
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Default Platform</label>
                  <select
                    value={platform}
                    onChange={(event) => setPlatform(event.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    <option>LinkedIn</option>
                    <option>X / Twitter</option>
                    <option>Instagram</option>
                    <option>Facebook</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Posting Cadence</label>
                  <select
                    value={cadence}
                    onChange={(event) => setCadence(event.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    <option>Weekly</option>
                    <option>Twice a week</option>
                    <option>Monthly</option>
                    <option>Whenever I ship</option>
                  </select>
                </div>

                <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md shadow-emerald-500/20" type="submit">
                  Save Preferences
                </button>
              </div>
            </form>

            {/* 03 LinkedIn OAuth 2.0 Integration Box */}
            <div className="settings-panel bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="settings-panel-heading flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-extrabold text-xs flex items-center justify-center border border-emerald-500/40">
                    03
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">LinkedIn Account Authorization</h3>
                    <p className="text-xs text-slate-400">OAuth 2.0 3-Legged authentication for posting</p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    linkedinStatus.connected
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  }`}
                >
                  {linkedinStatus.connected ? "Connected ✓" : "Pending Authorization"}
                </span>
              </div>

              {linkedinStatus.connected ? (
                <div className="settings-linkedin-connected p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="settings-token-summary flex items-center justify-between">
                    <span className="settings-connected-profile text-xs font-semibold text-white">
                      Connected Profile: {linkedinStatus.profileName || "LinkedIn Member"}
                    </span>
                    <span className="settings-token-badge inline-flex items-center gap-1.5 text-[10px] text-emerald-300 font-semibold bg-emerald-950 px-2 py-1 rounded border border-emerald-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                      Active token
                    </span>
                  </div>

                  {linkedinStatus.personUrn && (
                    <div className="text-[11px] text-slate-400 font-mono break-all bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-500">Person URN: </span>
                      <span className="text-slate-200">{linkedinStatus.personUrn}</span>
                    </div>
                  )}

                  <button
                    onClick={handleConnectLinkedin}
                    className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors mt-1"
                  >
                    Re-authenticate LinkedIn
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Connecting LinkedIn allows GitPulse to retrieve your <strong>Person URN</strong> and <strong>Access Token</strong> automatically via official OAuth 2.0 authorization.
                  </p>

                  <button
                    onClick={handleConnectLinkedin}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                    Connect LinkedIn Account
                  </button>
                </div>
              )}

              {/* Developer Redirect URL Instructions Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>ℹ️</span> Required LinkedIn Developer Portal Setup:
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  In your LinkedIn Developer App (under <strong>Auth → OAuth 2.0 settings</strong>), add this exact Authorized Redirect URL:
                </p>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-400 break-all select-all">
                  {appOrigin
                    ? `${appOrigin}/api/auth/linkedin/callback`
                    : "Loading current environment URL..."}
                </div>
                <p className="text-slate-500 text-[10px]">
                  Use this exact URL in your LinkedIn Developer App for the current environment.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Profile & Connections Overview */}
          <div className="settings-side-column lg:col-span-5 space-y-6">
            <section className="settings-profile-card bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="settings-profile-summary flex items-center gap-4">
                {avatarUrl || user?.avatarUrl ? (
                  <img
                    src={avatarUrl || user?.avatarUrl}
                    alt={user?.name || name || "Avatar"}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400/40 shadow-lg shadow-emerald-500/20"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-slate-950 text-xl font-extrabold flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    {(user?.name || name || "WM").slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400 block font-semibold">Active Member</span>
                  <strong className="text-base text-white block">{name || user?.name || "Workspace member"}</strong>
                  <small className="text-xs text-slate-400">{email || user?.email || "Loading account..."}</small>
                </div>
              </div>
              {user?.bio && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 italic">
                  &ldquo;{user.bio}&rdquo;
                </div>
              )}
            </section>

            <section className="settings-panel settings-connections bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="settings-panel-heading flex items-center gap-3 border-b border-slate-800 pb-3">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-extrabold text-xs flex items-center justify-center border border-emerald-500/40">
                  04
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">Connections</h3>
                  <p className="text-xs text-slate-400">Services powering your workspace</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <strong className="text-white block">GitHub</strong>
                    <small className="text-slate-400">Activity source</small>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${githubConnected ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-400"}`}>
                    {githubConnected ? "Connected" : "Not connected"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <strong className="text-white block">LinkedIn OAuth 2.0</strong>
                    <small className="text-slate-400">Member social token & Person URN</small>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${linkedinStatus.connected ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
                    {linkedinStatus.connected ? "Connected" : "Pending"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <strong className="text-white block">GitPulse AI Engine</strong>
                    <small className="text-slate-400">7 Story Angles & Quality Audit</small>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                    Active
                  </span>
                </div>
              </div>
            </section>

          </div>
        </div>

        <section className="settings-danger-zone rounded-2xl border border-rose-500/25 bg-rose-950/20 p-5 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-rose-200">Delete account</h3>
            <p className="mt-1 text-xs leading-relaxed text-rose-200/65">
              Permanently remove your profile, workspace preferences, and password reset data. This cannot be undone.
            </p>
          </div>
          {deleteError && (
            <p role="alert" className="rounded-lg border border-rose-400/30 bg-rose-950/50 p-2.5 text-xs text-rose-200">
              {deleteError}
            </p>
          )}
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={deletingAccount}
            className="w-full rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deletingAccount ? "Deleting account..." : "Delete my account"}
          </button>
        </section>
      </div>
    </AppShell>
  );
}
