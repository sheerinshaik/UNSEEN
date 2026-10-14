import { Router } from 'express';
import { Report, VALID_CATEGORIES } from '../models/Report.js';
import { UserVault } from '../models/UserVault.js';
import { AuditLog } from '../models/AuditLog.js';
import { AppConfig, getActiveCategories } from '../models/Config.js';
import { generateReportReference, generateTrackingSecret, hashTrackingSecret, verifyTrackingSecret } from '../utils/crypto.js';
import { validate, submitReportSchema, trackReportSchema } from '../middleware/validation.js';
import { reportSubmissionLimiter, reportTrackingLimiter } from '../middleware/rateLimiter.js';
import { authenticateToken, requireAuth } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/reports/categories
 * Returns active categories and reporting guidelines
 */
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await getActiveCategories();
    return res.status(200).json({
      success: true,
      categories,
      guidelines: {
        textPrompt: 'Tell us what happened, why it is a problem, and what outcome would help.',
        minCharacters: 20,
        maxCharacters: 5000,
        privacyWarning:
          'Warning: The text of your report will be read by reviewers. Avoid including personal names, phone numbers, unique identifiers, or specific details that could unintentionally reveal your identity.'
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/reports/disclosure-summary
 * Returns the exact technical privacy and information-sharing disclosure
 */
router.get('/disclosure-summary', (req, res) => {
  return res.status(200).json({
    success: true,
    disclosure: {
      includedInReport: [
        'Selected category',
        'Problem description narrative',
        'Optional approximate date or period',
        'Optional general department or location',
        'Optional requested resolution',
        'Cryptographic non-sequential reference',
        'Submission timestamp'
      ],
      visibleToReviewers: [
        'Report reference (e.g. UNS-XXXX-XXXX-XXXX)',
        'Category and narrative description',
        'Department / general location (if provided)',
        'Requested resolution (if provided)',
        'Workflow status and timeline history'
      ],
      neverVisibleToReviewers: [
        'Submitter account email',
        'Submitter user account ID',
        'Submitter password or password hash',
        'Submitter IP address',
        'Private tracking secret'
      ],
      workflowRequiresIdentity: false,
      knownLimitations: [
        'Self-identifying details in narrative text can inadvertently disclose your identity to reviewers.',
        'Network timing correlation could theoretically be attempted by sophisticated adversaries with ISP/datacenter level visibility.',
        'Platform administrators with root database access operate under least-privilege principles, but UNSEEN does not claim absolute zero-knowledge against compromised physical hosting infrastructure.'
      ]
    }
  });
});

/**
 * POST /api/reports/submit
 * Submit a confidential report with zero identity linkage
 */
router.post(
  '/submit',
  reportSubmissionLimiter,
  authenticateToken,
  validate(submitReportSchema),
  async (req, res, next) => {
    try {
      const { category, description, incidentDate, departmentOrLocation, requestedResolution } = req.body;

      // 1. Generate unique random reference and secret
      let reference = generateReportReference();
      let exists = await Report.findOne({ reference });
      while (exists) {
        reference = generateReportReference();
        exists = await Report.findOne({ reference });
      }

      const trackingSecret = generateTrackingSecret();
      const trackingSecretHash = hashTrackingSecret(trackingSecret);

      // 2. Create the report document (NO submitter identity is stored in Report collection)
      const newReport = await Report.create({
        reference,
        category,
        description,
        incidentDate: incidentDate || '',
        departmentOrLocation: departmentOrLocation || '',
        requestedResolution: requestedResolution || '',
        status: 'Submitted',
        priority: 'Standard',
        trackingSecretHash,
        timeline: [
          {
            status: 'Submitted',
            note: 'Report securely registered with zero reviewer-visible submitter identity.',
            updatedByRole: 'System',
            timestamp: new Date()
          }
        ]
      });

      // 3. If user is authenticated, link reference in their private UserVault
      if (req.user) {
        await UserVault.create({
          userId: req.user._id,
          reportReference: reference,
          category: category,
          submittedAt: new Date()
        });
      }

      // 4. Safe audit log
      await AuditLog.create({
        action: 'REPORT_SUBMITTED',
        actorRole: req.user ? 'Citizen' : 'Anonymous',
        reference,
        details: `Report registered in category: ${category}`,
        status: 'SUCCESS'
      });

      // 5. Return confirmation with the one-time tracking secret
      return res.status(201).json({
        success: true,
        message: 'Report submitted successfully.',
        report: {
          reference: newReport.reference,
          category: newReport.category,
          status: newReport.status,
          createdAt: newReport.createdAt,
          // PLAINTEXT SECRET RETURNED ONCE: Never stored on server
          trackingSecret,
          notice: 'Please securely store your tracking secret. It is required to view updates anonymously and cannot be recovered if lost.'
        }
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/reports/track
 * Retrieve private report details using reference + high-entropy tracking secret
 * (Possession of reference alone DOES NOT grant access)
 */
router.post('/track', reportTrackingLimiter, validate(trackReportSchema), async (req, res, next) => {
  try {
    const { reference, trackingSecret } = req.body;

    const report = await Report.findOne({ reference }).select('+trackingSecretHash');
    if (!report) {
      await AuditLog.create({
        action: 'TRACK_REPORT_FAILED',
        actorRole: 'Anonymous',
        reference,
        details: 'Lookup attempted with non-existent reference.',
        status: 'FAILURE'
      });
      return res.status(404).json({
        success: false,
        error: 'No report found with this reference and secret combination.'
      });
    }

    // Verify tracking secret against stored cryptographic hash
    const isValidSecret = verifyTrackingSecret(trackingSecret, report.trackingSecretHash);
    if (!isValidSecret) {
      await AuditLog.create({
        action: 'TRACK_REPORT_DENIED',
        actorRole: 'Anonymous',
        reference,
        details: 'Lookup failed due to invalid tracking secret.',
        status: 'DENIED'
      });
      return res.status(401).json({
        success: false,
        error: 'Invalid tracking secret. Access to private report details is denied.'
      });
    }

    // Return report details without secret hash or internal keys
    const reportObj = report.toJSON();
    delete reportObj.trackingSecretHash;
    delete reportObj.__v;

    return res.status(200).json({
      success: true,
      report: reportObj
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/reports/my-reports
 * For authenticated citizens to view reports stored in their personal private vault
 */
router.get('/my-reports', authenticateToken, requireAuth, async (req, res, next) => {
  try {
    const vaultEntries = await UserVault.find({ userId: req.user._id }).sort({ submittedAt: -1 });
    const references = vaultEntries.map((v) => v.reportReference);

    const reports = await Report.find({ reference: { $in: references } })
      .select('-trackingSecretHash')
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (err) {
    next(err);
  }
});

export default router;
