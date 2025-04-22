"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubService = void 0;
// src/services/github.service.ts
const octokit_1 = require("octokit");
class GitHubService {
    constructor(token) {
        this.octokit = new octokit_1.Octokit({
            auth: token,
            userAgent: 'QuickFront GitHub Integration'
        });
    }
    createRepository(name_1, description_1) {
        return __awaiter(this, arguments, void 0, function* (name, description, isPrivate = false) {
            return this.octokit.rest.repos.createForAuthenticatedUser({
                name,
                description,
                private: isPrivate,
                auto_init: false
            });
        });
    }
    pushFiles(repo_1, files_1) {
        return __awaiter(this, arguments, void 0, function* (repo, files, branch = 'main') {
            const [owner, repoName] = repo.split('/');
            // Get reference
            const { data: refData } = yield this.octokit.rest.git.getRef({
                owner,
                repo: repoName,
                ref: `heads/${branch}`
            });
            // Create blobs (files)
            const blobs = yield Promise.all(files.map(file => this.octokit.rest.git.createBlob({
                owner,
                repo: repoName,
                content: file.content,
                encoding: 'utf-8'
            })));
            // Create tree
            const { data: tree } = yield this.octokit.rest.git.createTree({
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
            const { data: commit } = yield this.octokit.rest.git.createCommit({
                owner,
                repo: repoName,
                message: 'Initial commit from QuickFront',
                tree: tree.sha,
                parents: [refData.object.sha]
            });
            // Update reference
            yield this.octokit.rest.git.updateRef({
                owner,
                repo: repoName,
                ref: `heads/${branch}`,
                sha: commit.sha
            });
            return commit;
        });
    }
    getUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.octokit.rest.users.getAuthenticated();
        });
    }
    createWebhook(repo, webhookUrl) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
exports.GitHubService = GitHubService;
