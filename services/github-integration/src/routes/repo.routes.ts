// src/routes/repo.routes.ts
import { Router } from 'express';
import { createAndPush } from '../controllers/repo.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

router.post(
  '/',
  authMiddleware,
  async (req, res, next) => {
    try {
      await createAndPush(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
