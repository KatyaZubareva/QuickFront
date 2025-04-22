// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.github_token;

  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
};

export default authMiddleware;
