// src/utils/github.utils.ts
import { Octokit } from "@octokit/rest";

export const validateGitHubToken = async (token: string): Promise<boolean> => {
  try {
    const octokit = new Octokit({ auth: token });
    await octokit.users.getAuthenticated();
    return true;
  } catch (error) {
    return false;
  }
};

export const extractRepoInfoFromUrl = (url: string) => {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  return match ? { owner: match[1], repo: match[2] } : null;
};

export const formatGitHubError = (error: any): string => {
  if (error.response) {
    return `GitHub API Error: ${error.response.status} - ${error.response.data.message}`;
  }
  return error.message || 'Unknown GitHub error';
};