import Anthropic from "@anthropic-ai/sdk";

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const PLATFORM_BRIEF = {
  linkedin:
    "LinkedIn opportunity post. Write a professional, warm post for a junior developer looking for a paid web development job, internship, remote work, or freelance opportunity. Use a strong headline, a short introduction, a Skills section based only on the supplied stack, a Projects section with real clickable GitHub URLs, a clear availability statement, and a respectful DM call-to-action. Use tasteful emojis and 3-5 relevant hashtags. Do not invent location, experience, skills, portfolio URLs, or employers.",
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
    ? `${normalized.commitCount} commit${normalized.commitCount === 1 ? "" : "s"}`
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
  const repoLinks = normalized.reposTouched.slice(0, 3).map((repo) => `https://github.com/${repo}`).join("\n");
  const commitLinks = normalized.commits.slice(0, 3).filter((commit) => commit.url).map((commit) => `- ${commit.message.split("\n")[0]}: ${commit.url}`).join("\n");
  const skills = normalized.topLanguages.length
    ? normalized.topLanguages.join(", ")
    : "JavaScript, web development, Git, and responsive UI";

  if (safePlatform === "instagram") {
    return `🚀 Build-in-public update\n\nThis week I shipped ${commitText}, opened ${prText}, and created ${repoText}. The focus was turning consistent effort into a cleaner, more useful product.\n\n🧠 Main stack: ${normalized.topLanguages.slice(0, 3).join(", ") || "JavaScript"}\n📦 Projects: ${projectNames}\n\n🔗 Explore the work:\n${repoLinks}\n\n#buildinpublic #developerlife #softwareengineering #webdevelopment`;
  }

  if (safePlatform === "facebook") {
    return `✨ A quick GitHub update from the last ${normalized.windowDays} days\n\nI made ${commitText}, opened ${prText}, and created ${repoText}. This week was about steady shipping, improving the details, and moving the product forward with intention.\n\n💻 Worked across: ${projectNames}\n🛠️ Technologies: ${normalized.topLanguages.slice(0, 3).join(", ") || "JavaScript"}\n\nSee the work:\n${repoLinks}`;
  }

  return `💼 Open to Paid Web Development Opportunities | Internship | Freelance\n\nAssalamualaikum everyone,\n\nI am a junior web developer actively looking for a paid opportunity where I can work on real-world projects, contribute to a strong team, improve my skills, and grow through meaningful work.\n\n🛠️ Skills and current focus:\n• ${skills}\n• Building responsive, practical web experiences\n• Working with GitHub projects and consistent development workflows\n\n🚀 Recent activity:\n• ${commitText} across ${projectNames}\n• ${prText} and ${repoText}\n• Focused on shipping improvements and turning ideas into useful products\n\n🌐 Projects and work:\n${repoLinks}\n${commitLinks ? `\n🔍 Recent commit details:\n${commitLinks}\n` : ""}\nI am open to paid internships, junior developer roles, remote work, and freelance projects. If you are hiring or have a project where I can contribute, please feel free to DM me. I would be happy to share my portfolio and CV.\n\nThank you!\n\n#OpenToWork #WebDevelopment #FrontendDeveloper #Internship #FreelanceDeveloper`;
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
Commit messages (sample): ${normalized.commits.map((c) => `${c.message} (${c.url || "no URL"})`).join("; ") || "none"}
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
        "You write polished, professional build-in-public social posts for developers based only on the real GitHub activity provided. Never invent commits, numbers, projects, or URLs. Use a useful length, clear paragraphs, tasteful emojis where appropriate, and include the provided repository or commit URLs so readers can explore the work. If activity is thin, write something modest and honest rather than exaggerating.",
      messages: [
        {
          role: "user",
            content: `Write a polished post for ${brief}. Follow the requested structure closely. Make it specific and professional, use tasteful emojis, include real clickable URLs from the supplied data, and do not add facts that are not present.\n\nHere is my GitHub activity data:\n${activityText}\n\nReturn only the post text, nothing else.`,
        },
      ],
    });

    const text = message.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("\n")
      .trim();

    if (!text) return buildFallbackPost(normalized, safePlatform);
    if (normalized.reposTouched.length && !text.includes("https://github.com/")) {
      return `${text}\n\n🔗 Explore the work:\n${repoLinks}`;
    }
    return text;
  } catch (error) {
    return buildFallbackPost(normalized, safePlatform);
  }
}
