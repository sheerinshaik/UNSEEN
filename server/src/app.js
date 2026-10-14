import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import { ENV } from './config/env.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import reportsRoutes from './routes/reports.routes.js';
import reviewerRoutes from './routes/reviewer.routes.js';
import adminRoutes from './routes/admin.routes.js';
import demoRoutes from './routes/demo.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// Trust proxy if running behind reverse proxy
app.set('trust proxy', 1);

// Security Headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows flexible development and Vite dev server
    crossOriginEmbedderPolicy: false
  })
);

// CORS Configuration with strict credentials support
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman, same origin)
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        ENV.CLIENT_ORIGIN,
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5000',
        'http://127.0.0.1:5000'
      ];
      if (allowedOrigins.includes(origin) || ENV.NODE_ENV === 'development') {
        return callback(null, true);
      }
      return callback(new Error('CORS origin unauthorized by policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// Body parsing with safe size bounds
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(cookieParser());

// Apply global rate limiting across all API endpoints
app.use('/api', globalLimiter);

// API Route mounts
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/reviewer', reviewerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/demo', demoRoutes);

// In production, serve the client build if available
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      // In dev mode when client dist isn't built yet
      res.status(200).send('UNSEEN Backend API Server running. Start Vite client on http://localhost:5173');
    }
  });
});

// 404 Handler for undefined API routes
app.use(notFoundHandler);

// Global Safe Error Handler
app.use(errorHandler);
