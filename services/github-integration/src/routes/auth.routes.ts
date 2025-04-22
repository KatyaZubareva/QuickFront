// src/routes/auth.routes.ts
import { Router } from 'express';
import { callback, logout } from '../controllers/auth.controller';
import { validateAuthCode } from '../middlewares/validateAuth';
import { authLimiter } from '../middlewares/rateLimit';

const router = Router();

/**
 * GitHub OAuth callback route
 * - Rate limited to prevent abuse
 * - Validates the auth code
 * - Handles the OAuth callback
 */
router.get('/callback', authLimiter, validateAuthCode, callback);

/**
 * Logout route
 * - Clears the GitHub token cookie
 */
router.post('/logout', logout);

export default router;