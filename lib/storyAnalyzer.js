/**
 * lib/storyAnalyzer.js
 * GitPulse 2.0 AI Story Detection Engine
 * 
 * Analyzes raw GitHub activity, extracts key developer achievements, 
 * generates the "GitPulse Found" narrative summary, assigns suggested story angle,
 * and compiles evidence mapping.
 */

export const STORY_ANGLES = [
  {
    id: "auto_ai",
    label: "✨ Let AI Decide",
    icon: "✨",
    description: "AI analyzes your activity and selects the strongest angle automatically.",
  },
  {
    id: "product_update",
    label: "🚀 Product Update",
    icon: "🚀",
    description: "For shipping new features, UI upgrades, or functional additions.",
  },
  {
    id: "what_i_learned",
    label: "🧠 What I Learned",
    icon: "🧠",
    description: "For skill growth, architectural lessons, or overcoming hurdles.",
  },
  {
    id: "technical_breakdown",
    label: "🔧 Technical Breakdown",
    icon: "🔧",
    description: "For refactoring, API optimization, data structure changes, or code quality.",
  },
  {
    id: "build_in_public",
    label: "📈 Progress Update",
    icon: "📈",
    description: "Build-in-public focus on steady shipping, consistency, and journey milestones.",
  },
  {
    id: "problem_solution",
    label: "🐛 Problem → Solution",
    icon: "🐛",
    description: "For debugging, fixing complex bugs, and resolving performance bottlenecks.",
  },
  {
    id: "milestone",
    label: "🎯 Major Milestone",
    icon: "🎯",
    description: "For new repository launches, v1 releases, or major project completions.",
  },
];

/**
 * Analyzes GitHub activity summary and generates intelligent story detection metadata.
 */
export function analyzeGitHubStory(summary) {
  if (!summary) return null;

  const {
    commits = [],
    pullRequests = [],
    newRepos = [],
    reposTouched = [],
    topLanguages = [],
    commitCount = 0,
    windowDays = 7,
  } = summary;

  // 1. Classify commit intent
  let featCount = 0;
  let fixCount = 0;
  let refactorCount = 0;
  let docsCount = 0;
  let generalCount = 0;

  const keyActivities = [];
  const evidenceList = [];

  commits.forEach((c, idx) => {
    const msg = (c.message || "").toLowerCase();
    const firstLine = c.message ? c.message.split("\n")[0] : "Commit update";
    let type = "work";

    if (msg.includes("feat") || msg.includes("add") || msg.includes("implement") || msg.includes("new") || msg.includes("create")) {
      featCount++;
      type = "feature";
    } else if (msg.includes("fix") || msg.includes("bug") || msg.includes("patch") || msg.includes("resolve") || msg.includes("issue")) {
      fixCount++;
      type = "bugfix";
    } else if (msg.includes("refactor") || msg.includes("clean") || msg.includes("optimiz") || msg.includes("structure") || msg.includes("perf")) {
      refactorCount++;
      type = "refactor";
    } else if (msg.includes("doc") || msg.includes("readme") || msg.includes("comment")) {
      docsCount++;
      type = "documentation";
    } else {
      generalCount++;
    }

    if (idx < 8) {
      keyActivities.push(firstLine);
    }

    // Build evidence item
    evidenceList.push({
      id: `ev-${idx + 1}`,
      type,
      headline: firstLine,
      repo: c.repo || reposTouched[0] || "repository",
      url: c.url || `https://github.com/${c.repo || ""}`,
      details: `Commit message: "${firstLine}" across ${c.repo || "repo"}. Languages: ${topLanguages.slice(0, 2).join(", ") || "Code"}.`,
    });
  });

  // Pull request evidence
  pullRequests.forEach((pr, idx) => {
    evidenceList.push({
      id: `ev-pr-${idx + 1}`,
      type: "pull_request",
      headline: `Opened PR: ${pr.title}`,
      repo: pr.repo,
      url: `https://github.com/${pr.repo}`,
      details: `Pull request "${pr.title}" in repository ${pr.repo}`,
    });
  });

  // New repo evidence
  newRepos.forEach((repo, idx) => {
    evidenceList.push({
      id: `ev-repo-${idx + 1}`,
      type: "new_repo",
      headline: `Created new repo: ${repo}`,
      repo,
      url: `https://github.com/${repo}`,
      details: `New public repository initialized: ${repo}`,
    });
  });

  // 2. Determine Primary Story Angle & Narrative
  let suggestedAngle = "build_in_public";
  let storyHeadline = "Steady shipping & incremental progress";
  let storyNarrative = "";
  let confidence = "High";

  if (newRepos.length > 0) {
    suggestedAngle = "milestone";
    storyHeadline = `Launched new project space (${newRepos[0]})`;
    storyNarrative = `You initialized ${newRepos.length} new repository and shipped ${commitCount} commit(s). Focus was on laying new codebase foundations.`;
  } else if (featCount >= fixCount && featCount >= refactorCount && featCount > 0) {
    suggestedAngle = "product_update";
    storyHeadline = `Feature additions & product expansion`;
    storyNarrative = `You pushed ${featCount} feature improvement(s) across ${reposTouched.length || 1} repository(ies), focusing on adding core capabilities.`;
  } else if (fixCount > featCount && fixCount >= refactorCount) {
    suggestedAngle = "problem_solution";
    storyHeadline = `Debugging, bug fixes & system stabilization`;
    storyNarrative = `You resolved key issues and fixed ${fixCount} bug(s), strengthening app reliability and overall developer UX.`;
  } else if (refactorCount > 0) {
    suggestedAngle = "technical_breakdown";
    storyHeadline = `Code refactoring & architecture cleanup`;
    storyNarrative = `You invested effort into architectural refactoring (${refactorCount} commit(s)), making the codebase cleaner and easier to maintain.`;
  } else {
    suggestedAngle = "build_in_public";
    storyHeadline = `Building in public across ${topLanguages.slice(0, 2).join(" & ") || "web tech"}`;
    storyNarrative = `You maintained momentum with ${commitCount} commit(s) across ${reposTouched.join(", ") || "active repos"}, refining code and pushing daily updates.`;
  }

  // Fallback narrative if activity is quiet
  if (commitCount === 0 && pullRequests.length === 0 && newRepos.length === 0) {
    confidence = "Medium";
    storyHeadline = "Quiet week of focus and planning";
    storyNarrative = "No public commits recorded in this timeframe. Ideal opportunity to share learning reflections, architectural decisions, or upcoming roadmap ideas.";
    suggestedAngle = "what_i_learned";
  }

  const selectedAngleObj = STORY_ANGLES.find((a) => a.id === suggestedAngle) || STORY_ANGLES[1];

  return {
    headline: storyHeadline,
    narrative: storyNarrative,
    suggestedAngle,
    suggestedAngleLabel: selectedAngleObj.label,
    suggestedAngleIcon: selectedAngleObj.icon,
    confidence,
    breakdown: {
      features: featCount,
      fixes: fixCount,
      refactor: refactorCount,
      docs: docsCount,
      general: generalCount,
      pullRequests: pullRequests.length,
      newRepos: newRepos.length,
    },
    keyActivities: keyActivities.slice(0, 5),
    evidenceList: evidenceList.slice(0, 10),
  };
}
