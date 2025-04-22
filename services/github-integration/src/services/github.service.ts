// src/services/github.service.ts
import { Octokit } from 'octokit';

export class GitHubService {
  private octokit: Octokit;

  constructor(token: string) {
    this.octokit = new Octokit({
      auth: token,
      userAgent: 'QuickFront GitHub Integration'
    });
  }

  async createRepository(name: string, description: string, isPrivate: boolean = false) {
    return this.octokit.rest.repos.createForAuthenticatedUser({
      name,
      description,
      private: isPrivate,
      auto_init: false
    });
  }

  async pushFiles(repo: string, files: Array<{ path: string; content: string }>, branch: string = 'main') {
    const [owner, repoName] = repo.split('/');
    
    // Get reference
    const { data: refData } = await this.octokit.rest.git.getRef({
      owner,
      repo: repoName,
      ref: `heads/${branch}`
    });

    // Create blobs (files)
    const blobs = await Promise.all(
      files.map(file => 
        this.octokit.rest.git.createBlob({
          owner,
          repo: repoName,
          content: file.content,
          encoding: 'utf-8'
        })
      )
    );

    // Create tree
    const { data: tree } = await this.octokit.rest.git.createTree({
      owner,
      repo: repoName,
      tree: files.map((file, i) => ({
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: blobs[i].data.sha
      })),
      base_tree: refData.object.sha
    });

    // Create commit
    const { data: commit } = await this.octokit.rest.git.createCommit({
      owner,
      repo: repoName,
      message: 'Initial commit from QuickFront',
      tree: tree.sha,
      parents: [refData.object.sha]
    });

    // Update reference
    await this.octokit.rest.git.updateRef({
      owner,
      repo: repoName,
      ref: `heads/${branch}`,
      sha: commit.sha
    });

    return commit;
  }

  async getUser() {
    return this.octokit.rest.users.getAuthenticated();
  }

  async createWebhook(repo: string, webhookUrl: string) {
    const [owner, repoName] = repo.split('/');
    return this.octokit.rest.repos.createWebhook({
      owner,
      repo: repoName,
      config: {
        url: webhookUrl,
        content_type: 'json',
        secret: process.env.GITHUB_WEBHOOK_SECRET
      },
      events: ['push', 'pull_request']
    });
  }
}