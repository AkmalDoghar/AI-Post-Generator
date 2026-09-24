"use client";

import Link from "next/link";
import AppShell from "../../components/AppShell";

export default function PrivacyPolicyPage() {
  const lastUpdated = "September 23, 2026";

  return (
    <AppShell>
      <div className="privacy-page max-w-4xl mx-auto py-8 px-4 space-y-8">
        {/* Header */}
        <div className="privacy-header border-b border-slate-800 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span>🛡️ Legal & Privacy</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400">
            Last Updated: {lastUpdated} · Effective Date: Immediately upon use
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 text-slate-300 text-sm leading-relaxed font-sans">
          <section className="privacy-card bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 backdrop-blur-md">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400">01.</span> Introduction & Overview
            </h2>
            <p>
              At <strong>GitPulse</strong> ("we", "our", or "us"), accessible from git-plus.vercel.app, we respect your privacy and are committed to protecting the personal and technical data of developers who use our content generation studio.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, process, and safeguard your information when you connect your GitHub account, analyze activity, and generate social media drafts.
            </p>
          </section>

          <section className="privacy-card bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 backdrop-blur-md">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400">02.</span> Information We Collect
            </h2>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80">
                <strong className="text-white block mb-1">A. Public GitHub Activity Data</strong>
                We fetch public developer activity via the official GitHub REST API, including commit messages, repository names, pull request titles, language breakdowns, and commit timestamps.
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80">
                <strong className="text-white block mb-1">B. Account & Profile Credentials</strong>
                When you create an account, we collect basic details such as your name, email address, password hash (encrypted via bcrypt), and connected GitHub handle.
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80">
                <strong className="text-white block mb-1">C. Draft History & Content Preferences</strong>
                We store your selected story angles, tone preferences, length choices, and generated draft variations for your personal review.
              </div>
            </div>
          </section>

          <section className="privacy-card bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 backdrop-blur-md">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400">03.</span> How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
              <li>To detect engineering story themes ("GitPulse Found") and suggest relevant story angles.</li>
              <li>To construct evidence-backed social post drafts tailored for LinkedIn, X/Twitter, Instagram, and Facebook.</li>
              <li>To audit fact verification and prevent hallucinated numbers or fake performance claims.</li>
              <li>To provide weekly recap stories and historical activity analytics.</li>
              <li>To maintain account security and manage user settings.</li>
            </ul>
          </section>

          <section className="privacy-card bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 backdrop-blur-md">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400">04.</span> Third-Party Services & AI Processing
            </h2>
            <p>
              GitPulse utilizes external LLM APIs (such as Anthropic Claude SDK) solely to format developer activity logs into structured social drafts.
            </p>
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
              <strong>Strict Data Commitment:</strong> Your code, commit data, and credentials are <strong>NEVER sold</strong> to third parties or used to train public generative AI models without authorization.
            </div>
          </section>

          <section className="privacy-card bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 backdrop-blur-md">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400">05.</span> Manual Review & Publishing Safety
            </h2>
            <p>
              GitPulse operates strictly in <strong>Manual Review Mode</strong>. No content is ever published automatically to your social media accounts. You retain 100% control over reviewing, editing, and publishing all drafts.
            </p>
          </section>

          <section className="privacy-card bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 backdrop-blur-md">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400">06.</span> Data Rights & Account Management
            </h2>
            <p className="text-xs">
              You have full ownership of your data. You may:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
              <li>Disconnect or change your connected GitHub handle at any time in Settings.</li>
              <li>Delete your draft history or requests.</li>
              <li>Request complete removal of your account and stored data by contacting support.</li>
            </ul>
          </section>

          <section className="privacy-card bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 backdrop-blur-md">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400">07.</span> Contact Us
            </h2>
            <p className="text-xs">
              If you have any questions or concerns regarding this Privacy Policy or data handling, please reach out to us:
            </p>
            <div className="privacy-contact text-xs font-mono text-emerald-400 bg-slate-950 p-3 rounded-xl border border-slate-800 inline-block">
              Email: 84pakarmy@gmail.com · GitPulse Studio Support
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="privacy-footer pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <Link href="/dashboard" className="text-emerald-400 hover:underline font-semibold">
            ← Back to Content Studio
          </Link>
          <span>© 2026 GitPulse Studio. All rights reserved.</span>
        </div>
      </div>
    </AppShell>
  );
}
