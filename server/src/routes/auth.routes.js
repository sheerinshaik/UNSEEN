import { Router } from 'express';
import { User } from '../models/User.js';
import { AuditLog } from '../models/AuditLog.js';
import { hashPassword, comparePassword, signAuthToken } from '../utils/crypto.js';
import { validate, registerSchema, loginSchema } from '../middleware/validation.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { authenticateToken, requireAuth } from '../middleware/auth.js';
import { ENV } from '../config/env.js';

const router = Router();

// Cookie configuration options
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: ENV.COOKIE_SECURE,
  sameSite: ENV.COOKIE_SAME_SITE,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/'
};

/**
 * POST /api/auth/register
 * Register a new citizen account
 */
router.post('/register', authLimiter, validate(registerSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists.'
      });
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      email,
      passwordHash,
      role: 'citizen'
    });

    const token = signAuthToken({ userId: user._id.toString(), role: user.role });
    res.cookie('unseen_session', token, COOKIE_OPTIONS);

    await AuditLog.create({
      action: 'USER_REGISTERED',
      actorRole: 'Citizen',
      details: 'New citizen account registered successfully.',
      status: 'SUCCESS'
    });

    return res.status(201).json({
      success: true,
      message: 'Account successfully registered.',
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/login
 * Sign in existing user and issue secure HTTP-only session cookie
 */
router.post('/login', authLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !user.isActive) {
      await AuditLog.create({
        action: 'LOGIN_FAILED',
        actorRole: 'Anonymous',
        details: 'Failed login attempt with non-existent or inactive email.',
        status: 'FAILURE'
      });
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      await AuditLog.create({
        action: 'LOGIN_FAILED',
        actorRole: 'Anonymous',
        details: 'Failed login attempt due to incorrect password.',
        status: 'FAILURE'
      });
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    const token = signAuthToken({ userId: user._id.toString(), role: user.role });
    res.cookie('unseen_session', token, COOKIE_OPTIONS);

    await AuditLog.create({
      action: 'LOGIN_SUCCESS',
      actorRole: user.role === 'admin' ? 'Administrator' : user.role === 'reviewer' ? 'Reviewer' : 'Citizen',
      details: `Successful login for user role: ${user.role}`,
      status: 'SUCCESS'
    });

    return res.status(200).json({
      success: true,
      message: 'Successfully authenticated.',
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        department: user.department,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/logout
 * Invalidate session and clear HTTP-only cookie
 */
router.post('/logout', (req, res) => {
  res.clearCookie('unseen_session', {
    httpOnly: true,
    secure: ENV.COOKIE_SECURE,
    sameSite: ENV.COOKIE_SAME_SITE,
    path: '/'
  });

  return res.status(200).json({
    success: true,
    message: 'Successfully logged out and session cleared.'
  });
});

/**
 * GET /api/auth/me
 * Validate current session and retrieve profile
 */
router.get('/me', authenticateToken, (req, res) => {
  if (!req.user) {
    return res.status(200).json({
      success: true,
      authenticated: false,
      user: null
    });
  }

  return res.status(200).json({
    success: true,
    authenticated: true,
    user: {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
      department: req.user.department
    }
  });
});

export default router;
