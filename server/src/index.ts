import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import config from './config/index.js';

const app = express();
const PORT = config.port;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
