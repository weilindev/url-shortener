import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import redirectRoutes from './routes/redirect.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import config from './config/index.js';
import { getRedisClient } from './config/redis.js';

const app = express();
const PORT = config.port;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Redirect routes (must be before API routes to avoid conflicts)
app.use('/r', redirectRoutes);

// API routes
app.use('/api', routes);

// Error handler
app.use(errorHandler);

// Initialize Redis connection and start server
const startServer = async () => {
  try {
    // Initialize Redis
    await getRedisClient();

    // Start Express server
    app.listen(PORT, () => {
      console.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize Redis:', error);
    console.warn('Server will continue without Redis cache');

    // Start server anyway, cache will be disabled
    app.listen(PORT, () => {
      console.info(`Server is running on port ${PORT} (Redis disabled)`);
    });
  }
};

void startServer();

export default app;
