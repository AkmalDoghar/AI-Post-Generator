import Anthropic from "@anthropic-ai/sdk";

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const PLATFORM_BRIEF = {
  linkedin:
    "LinkedIn. Professional but human tone, 2-4 short paragraphs, no hashtag spam (max 3 relevant hashtags at the end). Speak like a developer sharing real progress, not a marketer.",
  instagram:
    "Instagram caption. Casual, punchy, can use light emoji. 3-5 sentences. Include 5-8 relevant hashtags at the end on their own line.",
  facebook:
    "Facebook post. Friendly and conversational, 2-3 sentences, minimal hashtags.",
};

function normalizeSummary(summary) {
  if (!summary || typeof summary !== "object") {
    throw new Error("Missing activity summary.");
  }

  const username = summary.username || "developer";
  const windowDays = Number(summary.windowDays) || 7;
  const commitCount = Number(summary.commitCount) || 0;
  const commits = Array.isArray(summary.commits) ? summary.commits : [];
  const pullRequests = Array.isArray(summary.pullRequests) ? summary.pullRequests : [];
  const newRepos = Array.isArray(summary.newRepos) ? summary.newRepos : [];
  const reposTouched = Array.isArray(summary.reposTouched) ? summary.reposTouched : [];
  const topLanguages = Array.isArray(summary.topLanguages) ? summary.topLanguages : [];

  return {
    username,
    windowDays,
    commitCount,
    commits,
    pullRequests,
    newRepos,
    reposTouched,
    topLanguages,
  };
}

function buildFallbackPost(summary, platform = "linkedin") {
  const safePlatform = PLATFORM_BRIEF[platform] ? platform : "linkedin";
  const normalized = normalizeSummary(summary);
  const projectNames = normalized.reposTouched.length
    ? normalized.reposTouched.slice(0, 3).join(", ")
    : "a few repos";
  const commitText = normalized.commitCount
    ? `${normalized.commitCount} commits` 
    : "a light activity week";
  const prText = normalized.pullRequests.length
    ? `${normalized.pullRequests.length} PR${normalized.pullRequests.length > 1 ? "s" : ""}`
    : "no PRs";
  const repoText = normalized.newRepos.length
    ? `${normalized.newRepos.length} new repo${normalized.newRepos.length > 1 ? "s" : ""}`
    : "no new repos";
  const langText = normalized.topLanguages.length
    ? `Most of my work was in ${normalized.topLanguages.slice(0, 3).join(", ")}.`
    : "";

  if (safePlatform === "instagram") {
    return `A little build-in-public update from this week:\n\nI pushed ${commitText}, opened ${prText}, and created ${repoText}.\n\nI spent time working across ${projectNames}. ${langText}\n\n#buildinpublic #developerlife #softwareengineering`;
  }

  if (safePlatform === "facebook") {
    return `A quick GitHub update from the last ${normalized.windowDays} days:\n\nI made ${commitText}, opened ${prText}, and created ${repoText}. I also spent time working across ${projectNames}. ${langText}`;
  }

  return `This week on GitHub, I made ${commitText} and opened ${prText}. I also created ${repoText} while working across ${projectNames}. ${langText}\n\nIt was a steady week of shipping, learning, and tightening up the work in progress.`;
}

/**
 * Turns a GitHub activity summary into a ready-to-review draft for one platform.
 */
export async function generatePost(summary, platform = "linkedin") {
  const safePlatform = PLATFORM_BRIEF[platform] ? platform : "linkedin";
  const normalized = normalizeSummary(summary);

  if (!anthropic) {
    return buildFallbackPost(normalized, safePlatform);
  }

  const brief = PLATFORM_BRIEF[safePlatform] || PLATFORM_BRIEF.linkedin;

  const activityText = `
Username: ${normalized.username}
Window: last ${normalized.windowDays} days
Commits: ${normalized.commitCount}
Commit messages (sample): ${normalized.commits.map((c) => c.message).join("; ") || "none"}
Pull requests opened: ${normalized.pullRequests.map((p) => p.title).join("; ") || "none"}
New repos created: ${normalized.newRepos.join(", ") || "none"}
Repos touched: ${normalized.reposTouched.join(", ") || "none"}
Top languages: ${normalized.topLanguages.join(", ") || "unknown"}
`.trim();

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 500,
      system:
        "You write short, authentic 'build in public' social posts for developers based on their real GitHub activity. Never invent commits, numbers, or projects that aren't in the data given. If the activity is thin, write something modest and honest rather than exaggerating.",
      messages: [
        {
          role: "user",
          content: `Write a post for ${brief}\n\nHere is my GitHub activity data:\n${activityText}\n\nReturn only the post text, nothing else.`,
        },
      ],
    });

    const text = message.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("\n")
      .trim();

    return text || buildFallbackPost(normalized, safePlatform);
  } catch (error) {
    return buildFallbackPost(normalized, safePlatform);
  }
}
