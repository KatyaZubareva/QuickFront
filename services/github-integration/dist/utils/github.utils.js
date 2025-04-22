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
exports.formatGitHubError = exports.extractRepoInfoFromUrl = exports.validateGitHubToken = void 0;
// src/utils/github.utils.ts
const rest_1 = require("@octokit/rest");
const validateGitHubToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const octokit = new rest_1.Octokit({ auth: token });
        yield octokit.users.getAuthenticated();
        return true;
    }
    catch (error) {
        return false;
    }
});
exports.validateGitHubToken = validateGitHubToken;
const extractRepoInfoFromUrl = (url) => {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    return match ? { owner: match[1], repo: match[2] } : null;
};
exports.extractRepoInfoFromUrl = extractRepoInfoFromUrl;
const formatGitHubError = (error) => {
    if (error.response) {
        return `GitHub API Error: ${error.response.status} - ${error.response.data.message}`;
    }
    return error.message || 'Unknown GitHub error';
};
exports.formatGitHubError = formatGitHubError;
