"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.routes.ts
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validateAuth_1 = require("../middlewares/validateAuth");
const rateLimit_1 = require("../middlewares/rateLimit");
const router = (0, express_1.Router)();
/**
 * GitHub OAuth callback route
 * - Rate limited to prevent abuse
 * - Validates the auth code
 * - Handles the OAuth callback
 */
router.get('/callback', rateLimit_1.authLimiter, validateAuth_1.validateAuthCode, auth_controller_1.callback);
/**
 * Logout route
 * - Clears the GitHub token cookie
 */
router.post('/logout', auth_controller_1.logout);
exports.default = router;
