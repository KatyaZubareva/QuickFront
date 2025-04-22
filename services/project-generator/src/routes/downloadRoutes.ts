//routes/DownloadController.ts
import { Router } from 'express';
import DownloadController from '../controllers/downloadController';

const router = Router();

router.get('/download', DownloadController.downloadProject);

export default router;