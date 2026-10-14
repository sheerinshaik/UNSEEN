import { Router } from 'express';
import { Report, VALID_STATUSES } from '../models/Report.js';
import { AuditLog } from '../models/AuditLog.js';
import { authenticateToken, requireAuth, requireRole } from '../middleware/auth.js';
import { validate, updateStatusSchema, addResponseSchema } from '../middleware/validation.js';

const router = Router();

// Enforce Reviewer or Admin authentication on all reviewer routes
router.use(authenticateToken);
router.use(requireAuth);
router.use(requireRole('reviewer', 'admin'));

/**
 * GET /api/reviewer/overview
 * Real computed metrics from the database
 */
router.get('/overview', async (req, res, next) => {
  try {
    const totalReports = await Report.countDocuments();
    const submittedCount = await Report.countDocuments({ status: 'Submitted' });
    const inReviewCount = await Report.countDocuments({ status: 'Under review' });
    const actionRequiredCount = await Report.countDocuments({ status: 'Action required' });
    const resolvedCount = await Report.countDocuments({ status: 'Resolved' });
    const closedCount = await Report.countDocuments({ status: 'Closed' });

    // Category breakdown
    const categoryStats = await Report.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Recent activity (last 5 status changes across reports)
    const recentReports = await Report.find()
      .select('reference category status priority updatedAt createdAt')
      .sort({ updatedAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      metrics: {
        total: totalReports,
        submitted: submittedCount,
        inReview: inReviewCount,
        actionRequired: actionRequiredCount,
        resolved: resolvedCount,
        closed: closedCount
      },
      categoryStats: categoryStats.map((c) => ({ category: c._id, count: c.count })),
      recentReports
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/reviewer/reports
 * Paginated report list with search and filters
 * PRIVACY GUARANTEE: Never includes submitter account details or tracking secret hashes
 */
router.get('/reports', async (req, res, next) => {
  try {
    const { status, category, priority, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status && VALID_STATUSES.includes(status)) {
      query.status = status;
    }
    if (category) {
      query.category = category;
    }
    if (priority) {
      query.priority = priority;
    }
    if (search) {
      query.$or = [
        { reference: { $regex: search, $options: 'i' } },
        { departmentOrLocation: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const total = await Report.countDocuments(query);

    const reports = await Report.find(query)
      .select('-trackingSecretHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    return res.status(200).json({
      success: true,
      reports,
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
 * GET /api/reviewer/reports/:reference
 * View single report details for review
 */
router.get('/reports/:reference', async (req, res, next) => {
  try {
    const { reference } = req.params;

    const report = await Report.findOne({ reference }).select('-trackingSecretHash');
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    return res.status(200).json({
      success: true,
      report
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/reviewer/reports/:reference/status
 * Update report status and append timeline note
 */
router.patch('/reports/:reference/status', validate(updateStatusSchema), async (req, res, next) => {
  try {
    const { reference } = req.params;
    const { status, note } = req.body;

    const report = await Report.findOne({ reference });
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    const previousStatus = report.status;
    report.status = status;

    report.timeline.push({
      status,
      note: note || `Status updated from ${previousStatus} to ${status}`,
      updatedByRole: 'Reviewer',
      timestamp: new Date()
    });

    await report.save();

    await AuditLog.create({
      action: 'REPORT_STATUS_UPDATED',
      actorRole: req.user.role === 'admin' ? 'Administrator' : 'Reviewer',
      reference,
      details: `Status transitioned from ${previousStatus} to ${status}`,
      status: 'SUCCESS'
    });

    return res.status(200).json({
      success: true,
      message: `Status updated to ${status}.`,
      report
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/reviewer/reports/:reference/responses
 * Post an official reviewer response visible to the submitter privately
 */
router.post('/reports/:reference/responses', validate(addResponseSchema), async (req, res, next) => {
  try {
    const { reference } = req.params;
    const { message, roleLabel } = req.body;

    const report = await Report.findOne({ reference });
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    report.reviewerResponses.push({
      message,
      roleLabel: roleLabel || 'Authorized Reviewer',
      timestamp: new Date()
    });

    report.timeline.push({
      status: report.status,
      note: `Official response added by ${roleLabel || 'Authorized Reviewer'}`,
      updatedByRole: 'Reviewer',
      timestamp: new Date()
    });

    await report.save();

    await AuditLog.create({
      action: 'REVIEWER_RESPONSE_ADDED',
      actorRole: 'Reviewer',
      reference,
      details: 'Official response attached to report.',
      status: 'SUCCESS'
    });

    return res.status(201).json({
      success: true,
      message: 'Official response submitted and attached to report.',
      reviewerResponses: report.reviewerResponses
    });
  } catch (err) {
    next(err);
  }
});

export default router;
