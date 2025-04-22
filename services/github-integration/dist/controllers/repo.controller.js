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
exports.repoController = exports.createAndPush = void 0;
const github_service_1 = require("../services/github.service");
const createAndPush = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectName, projectDescription, files } = req.body;
    const token = req.cookies.github_token;
    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    try {
        const github = new github_service_1.GitHubService(token);
        const repo = yield github.createRepository(projectName, projectDescription);
        yield github.pushFiles(repo.data.full_name, files);
        return res.json({
            success: true,
            repoUrl: repo.data.html_url
        });
    }
    catch (error) {
        console.error('Repo creation error:', error);
        return res.status(500).json(Object.assign({ error: 'Failed to create repository' }, (process.env.NODE_ENV === 'development' && { details: error instanceof Error ? error.message : 'Unknown error' })));
    }
});
exports.createAndPush = createAndPush;
exports.repoController = {
    createAndPush: exports.createAndPush
};
