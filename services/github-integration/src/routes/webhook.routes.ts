// src/routes/webhook.routes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { handleWebhook } from '../controllers/webhook.controller';

const router = Router();

/**
 * GitHub Webhook Endpoint
 * @route POST /webhooks
 * @desc Handles incoming GitHub webhook events
 * @access Public (but requires valid GitHub signature)
 */
router.post('/', 
  (req: Request, res: Response, next: NextFunction) => {
    if (req.headers['content-type'] !== 'application/json') {
      res.status(415).json({ error: 'Unsupported Media Type' });
      return;
    }
    next();
  },
  
  (req: Request, res: Response, next: NextFunction) => {
    try {
      handleWebhook(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;