export function hasGitHubProvider() {
  return Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET);
}

export function getAppUrl() {
  return process.env.AUTH_URL || "http://localhost:3000";
}

export function getGitHubCallbackUrl(origin = getAppUrl()) {
  return process.env.AUTH_GITHUB_CALLBACK_URL || `${origin.replace(/\/$/, "")}/api/auth/github/callback`;
}

export function getGitHubAuthorizeUrl(state, origin) {
  const params = new URLSearchParams({
    client_id: process.env.AUTH_GITHUB_ID,
    redirect_uri: getGitHubCallbackUrl(origin),
    scope: "read:user user:email",
    state,
  });

  return `https://github.com/login/oauth/authorize?${params}`;
}
