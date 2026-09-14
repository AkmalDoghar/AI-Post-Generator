# GitPulse

Pulls your GitHub activity (commits, PRs, new repos) and drafts a ready-to-review
social post about it — tuned per platform (LinkedIn, Instagram, Facebook, Twitter/X).
Nothing posts automatically; you review, edit, and copy it yourself. That's on
purpose — see "Why manual review first" below.

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

- `GITHUB_TOKEN` — a [personal access token](https://github.com/settings/tokens)
  with `public_repo` and `read:user` scope (classic token is fine for this).
- `GITHUB_USERNAME` — your GitHub username (optional if you always type it in the UI).
- `ANTHROPIC_API_KEY` — from [console.anthropic.com](https://console.anthropic.com).

Then run:

```bash
npm run dev
```

Open `http://localhost:3000`, enter a GitHub username, pull activity, and generate
a draft per platform.

## How it works

```
GitHub Events API  →  lib/github.js       (summarize commits, PRs, new repos, languages)
                            ↓
             app/api/github-activity      (API route, returns JSON summary)
                            ↓
          lib/generatePost.js + Claude    (turns summary into a platform-tuned draft)
                            ↓
             app/api/generate-post        (API route, returns draft text)
                            ↓
                    app/page.js           (dashboard: review, edit, copy)
```

## Why manual review first

Instagram and LinkedIn restrict fully automated posting on personal accounts, and
even where auto-posting is technically possible, publishing without a human check
is a fast way to post something embarrassing or inaccurate. The generator is also
instructed never to invent commits or numbers that aren't in your real activity data.
Review-then-copy is the safer default; automate publishing once you trust the drafts.

## Next steps to extend this

- **Scheduling**: run `github-activity` + `generate-post` on a daily/weekly cron
  (GitHub Actions or Vercel Cron) and email or Slack yourself the draft instead of
  needing to open the dashboard.
- **Auto-publish**: once you're comfortable, wire up:
  - LinkedIn — [Share API](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/share-api)
  - Meta (Facebook Pages + Instagram Business) — [Graph API](https://developers.facebook.com/docs/graph-api)
  - Twitter/X — [API v2](https://developer.twitter.com/en/docs/twitter-api)
- **Visuals**: generate a simple stats card (commits, streak, top language) as an
  image to attach to Instagram/LinkedIn posts.
- **Analytics**: store each published post + its engagement numbers in a database
  (Supabase/Postgres) to see what kind of updates perform best.
- **Auth**: swap the manual `GITHUB_USERNAME`/token for GitHub OAuth if you want
  other people to use this too, not just you.

## Stack

Next.js (App Router) · Tailwind CSS · Anthropic SDK · GitHub REST API
