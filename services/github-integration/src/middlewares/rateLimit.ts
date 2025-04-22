// src/middlewares/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per window
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false // Disable X-RateLimit-* headers
});