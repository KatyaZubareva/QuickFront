"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = void 0;
// src/utils/config.ts
const validateConfig = () => {
    const requiredVars = [
        'GITHUB_CLIENT_ID',
        'GITHUB_CLIENT_SECRET',
        'FRONTEND_REDIRECT_URI'
    ];
    const missing = requiredVars.filter(v => !process.env[v]);
    if (missing.length) {
        throw new Error(`Missing environment variables: ${missing.join(', ')}`);
    }
};
exports.validateConfig = validateConfig;
