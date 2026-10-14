import { verifyAuthToken } from '../utils/crypto.js';
import { User } from '../models/User.js';

export async function authenticateToken(req, res, next) {
  try {
    let token = null;

    // 1. Check HTTP-only cookie
    if (req.cookies && req.cookies.unseen_session) {
      token = req.cookies.unseen_session;
    }
    // 2. Check Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = verifyAuthToken(token);
    if (!decoded || !decoded.userId) {
      req.user = null;
      return next();
    }

    const user = await User.findById(decoded.userId).select('+isActive');
    if (!user || !user.isActive) {
      req.user = null;
      return next();
    }

    req.user = {
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
      department: user.department,
      isActive: user.isActive
    };

    next();
  } catch (error) {
    req.user = null;
    next();
  }
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please sign in to access this resource.'
    });
  }
  next();
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You do not possess the required authorization role.'
      });
    }

    next();
  };
}
