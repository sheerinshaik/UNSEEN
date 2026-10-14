import { Router } from 'express';
import { isDbConnected } from '../config/db.js';

const router = Router();

/**
 * GET /api/health
 * Public health-check endpoint for load balancers and deployment monitoring
 * Does NOT leak secrets, env variables, or database connection strings.
 */
router.get('/health', (req, res) => {
  const dbConnected = isDbConnected();

  const healthData = {
    status: dbConnected ? 'healthy' : 'degraded',
    service: 'UNSEEN API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected'
  };

  const statusCode = dbConnected ? 200 : 503;
  return res.status(statusCode).json(healthData);
});

export default router;
