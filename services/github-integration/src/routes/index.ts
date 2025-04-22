//routes/index.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import repoRoutes from './repo.routes';
import webhookRoutes from './webhook.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/repos', repoRoutes);
router.use('/webhooks', webhookRoutes);

export default router;