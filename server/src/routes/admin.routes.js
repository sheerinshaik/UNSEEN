import { Router } from 'express';
import { User } from '../models/User.js';
import { AuditLog } from '../models/AuditLog.js';
import { AppConfig, getActiveCategories } from '../models/Config.js';
import { hashPassword } from '../utils/crypto.js';
import { authenticateToken, requireAuth, requireRole } from '../middleware/auth.js';
import { validate, reviewerInviteSchema } from '../middleware/validation.js';

const router = Router();

// Enforce Administrator role strictly
router.use(authenticateToken);
router.use(requireAuth);
router.use(requireRole('admin'));

/**
 * GET /api/admin/overview
 * System-wide operational statistics
 */
router.get('/overview', async (req, res, next) => {
  try {
    const reviewerCount = await User.countDocuments({ role: 'reviewer' });
    const adminCount = await User.countDocuments({ role: 'admin' });
    const auditEventsCount = await AuditLog.countDocuments();
    const recentAuditLogs = await AuditLog.find().sort({ timestamp: -1 }).limit(10);

    return res.status(200).json({
      success: true,
      stats: {
        reviewers: reviewerCount,
        admins: adminCount,
        auditLogsTotal: auditEventsCount
      },
      recentAuditLogs
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/reviewers
 * List authorized reviewer accounts
 * (Notice: citizen accounts are not listed to prevent identity harvesting)
 */
router.get('/reviewers', async (req, res, next) => {
  try {
    const reviewers = await User.find({ role: { $in: ['reviewer', 'admin'] } })
      .select('email role department isActive createdAt updatedAt')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reviewers
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/reviewers
 * Provision a new reviewer account
 */
router.post('/reviewers', validate(reviewerInviteSchema), async (req, res, next) => {
  try {
    const { email, password, department } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists.'
      });
    }

    const passwordHash = await hashPassword(password);
    const newReviewer = await User.create({
      email,
      passwordHash,
      role: 'reviewer',
      department: department || 'General'
    });

    await AuditLog.create({
      action: 'REVIEWER_PROVISIONED',
      actorRole: 'Administrator',
      details: `New reviewer provisioned for department: ${department || 'General'}`,
      status: 'SUCCESS'
    });

    return res.status(201).json({
      success: true,
      message: 'Reviewer account successfully created.',
      reviewer: {
        id: newReviewer._id,
        email: newReviewer.email,
        role: newReviewer.role,
        department: newReviewer.department,
        isActive: newReviewer.isActive
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/admin/reviewers/:id/toggle-status
 * Activate or deactivate a staff reviewer account
 */
router.patch('/reviewers/:id/toggle-status', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id === req.user._id) {
      return res.status(400).json({
        success: false,
        error: 'Administrators cannot deactivate their own session account.'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User account not found.'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    await AuditLog.create({
      action: 'USER_STATUS_TOGGLED',
      actorRole: 'Administrator',
      details: `Account ${user.email} status toggled to: ${user.isActive ? 'Active' : 'Inactive'}`,
      status: 'SUCCESS'
    });

    return res.status(200).json({
      success: true,
      message: `Account status successfully set to ${user.isActive ? 'Active' : 'Inactive'}.`,
      user: {
        id: user._id,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/audit-logs
 * Review system and security audit events
 */
router.get('/audit-logs', async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

    const total = await AuditLog.countDocuments();
    const logs = await AuditLog.find().sort({ timestamp: -1 }).skip(skip).limit(parseInt(limit, 10));

    return res.status(200).json({
      success: true,
      logs,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        pages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/categories
 * View configurable categories
 */
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await getActiveCategories();
    return res.status(200).json({
      success: true,
      categories
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/admin/categories
 * Update configurable reporting categories
 */
router.put('/categories', async (req, res, next) => {
  try {
    const { categories } = req.body;
    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Categories must be an array of non-empty category names.'
      });
    }

    await AppConfig.findOneAndUpdate(
      { key: 'report_categories' },
      { key: 'report_categories', value: categories, description: 'Active report categories' },
      { upsert: true, new: true }
    );

    await AuditLog.create({
      action: 'CATEGORIES_CONFIG_UPDATED',
      actorRole: 'Administrator',
      details: `Updated active categories list (${categories.length} categories)`,
      status: 'SUCCESS'
    });

    return res.status(200).json({
      success: true,
      message: 'Reporting categories updated successfully.',
      categories
    });
  } catch (err) {
    next(err);
  }
});

export default router;
