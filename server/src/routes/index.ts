import express, { Request, Response } from 'express';

const router = express.Router();

// Example route
router.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to the API' });
});

// Add more routes here
// router.use('/users', userRoutes);
// router.use('/posts', postRoutes);

export default router;
