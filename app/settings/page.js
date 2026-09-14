import AppShell from "../../components/AppShell";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <p className="section-kicker">Settings</p>
          <h2 className="page-title mt-2">Workspace preferences</h2>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-panel space-y-6 rounded-3xl p-5">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">GitHub username</label>
              <input defaultValue="adnancode" className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400" />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Default platform</label>
              <select className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400">
                <option>LinkedIn</option>
                <option>Instagram</option>
                <option>Twitter / X</option>
                <option>Facebook</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Posting cadence</label>
              <input defaultValue="Weekly" className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400" />
            </div>

            <button className="rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-3 font-semibold text-slate-950">
              Save changes
            </button>
          </div>

          <div className="glass-panel rounded-3xl p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Integrations</div>
            <div className="mt-5 space-y-3">
              {[
                ["GitHub", "Connected"],
                ["Anthropic", "Connected"],
                ["LinkedIn", "Pending"],
              ].map(([service, status]) => (
                <div key={service} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/80 p-3">
                  <span className="text-white">{service}</span>
                  <span className={status === "Connected" ? "text-emerald-300" : "text-amber-300"}>{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
