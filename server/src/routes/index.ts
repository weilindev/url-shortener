import express, { Request, Response } from 'express';
import urlRoutes from './url.routes.js';

const router = express.Router();

// Example route
router.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to the API' });
});

// URL shortener routes
router.use('/urls', urlRoutes);

export default router;
