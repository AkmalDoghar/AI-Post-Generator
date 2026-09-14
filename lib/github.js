const GITHUB_API = "https://api.github.com";

function authHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

/**
 * Pulls a summary of a user's public activity for the last N days:
 * commits (via events), opened PRs, new repos, and a per-language tally.
 */
export async function fetchActivitySummary(username, days = 7) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const eventsRes = await fetch(
    `${GITHUB_API}/users/${username}/events/public?per_page=100`,
    { headers: authHeaders() }
  );
  if (!eventsRes.ok) {
    throw new Error(`GitHub events fetch failed: ${eventsRes.status}`);
  }
  const events = await eventsRes.json();

  const recent = events.filter((e) => new Date(e.created_at) >= since);

  const commits = [];
  const pullRequests = [];
  const newRepos = [];
  const repoTouched = new Set();

  for (const event of recent) {
    repoTouched.add(event.repo?.name);

    if (event.type === "PushEvent") {
      for (const c of event.payload?.commits || []) {
        commits.push({ repo: event.repo.name, message: c.message });
      }
    }
    if (event.type === "PullRequestEvent" && event.payload?.action === "opened") {
      pullRequests.push({
        repo: event.repo.name,
        title: event.payload.pull_request?.title,
      });
    }
    if (event.type === "CreateEvent" && event.payload?.ref_type === "repository") {
      newRepos.push(event.repo.name);
    }
  }

  // Language tally across touched repos (best-effort, capped to avoid rate limits)
  const languages = {};
  const reposToCheck = Array.from(repoTouched).filter(Boolean).slice(0, 10);
  for (const repoFullName of reposToCheck) {
    try {
      const res = await fetch(`${GITHUB_API}/repos/${repoFullName}/languages`, {
        headers: authHeaders(),
      });
      if (res.ok) {
        const langData = await res.json();
        for (const [lang, bytes] of Object.entries(langData)) {
          languages[lang] = (languages[lang] || 0) + bytes;
        }
      }
    } catch {
      // skip repos we can't read (private, deleted, rate-limited)
    }
  }

  return {
    username,
    windowDays: days,
    commitCount: commits.length,
    commits: commits.slice(0, 25),
    pullRequests,
    newRepos,
    reposTouched: Array.from(repoTouched).filter(Boolean),
    topLanguages: Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang]) => lang),
  };
}
