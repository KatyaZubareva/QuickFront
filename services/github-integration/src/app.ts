// src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import routes from './routes';
import authRoutes from './routes/auth.routes';

// Create Express application
const app = express();

// Environment configuration
const isProduction = process.env.NODE_ENV === 'production';

// CORS configuration
const corsOptions = {
  origin: isProduction 
    ? ['https://your-production-domain.com'] 
    : ['http://localhost:3002'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(helmet());
app.use(cookieParser());
app.use(morgan(isProduction ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// API routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy' });
});

app.use('/auth', authRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.stack);
  res.status(500).json({
    error: isProduction ? 'Internal server error' : err.message,
    ...(!isProduction && { stack: err.stack })
  });
});

// Server configuration with proper port type handling
const getPort = (): number => {
  const port = process.env.PORT;
  if (!port) return 3002; // Default port
  
  const parsedPort = parseInt(port, 10);
  if (isNaN(parsedPort)) {
    console.warn(`Invalid PORT "${port}", using default 3002`);
    return 3002;
  }
  
  if (parsedPort < 1 || parsedPort > 65535) {
    console.warn(`PORT ${parsedPort} out of range, using default 3002`);
    return 3002;
  }
  
  return parsedPort;
};

const PORT = getPort();
const HOST = process.env.HOST || '0.0.0.0';

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`[${new Date().toISOString()}] Server started`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Listening on: http://${HOST}:${PORT}`);
});

// Handle server errors
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') throw error;

  switch (error.code) {
    case 'EACCES':
      console.error(`Port ${PORT} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`Port ${PORT} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Handle process signals
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server terminated');
  });
});

export default app;