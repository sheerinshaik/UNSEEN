import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Report } from '../models/Report.js';
import { UserVault } from '../models/UserVault.js';
import { AuditLog } from '../models/AuditLog.js';
import { hashPassword, hashTrackingSecret } from '../utils/crypto.js';
import { logger } from '../utils/logger.js';

async function seedData() {
  try {
    await connectDB();
    logger.info('Clearing existing demo collections...');

    await User.deleteMany({});
    await Report.deleteMany({});
    await UserVault.deleteMany({});
    await AuditLog.deleteMany({});

    logger.info('Seeding accounts...');

    // 1. Admin
    const adminPass = await hashPassword('AdminSecure2026!');
    const admin = await User.create({
      email: 'admin@unseen.internal',
      passwordHash: adminPass,
      role: 'admin',
      department: 'Platform Governance'
    });

    // 2. Reviewers
    const reviewerPass = await hashPassword('ReviewerPass2026!');
    const ombudsman = await User.create({
      email: 'ombuds@unseen.internal',
      passwordHash: reviewerPass,
      role: 'reviewer',
      department: 'Student & Academic Welfare'
    });

    const ethics = await User.create({
      email: 'ethics@unseen.internal',
      passwordHash: reviewerPass,
      role: 'reviewer',
      department: 'Ethics & Compliance'
    });

    // 3. Citizen Demo User
    const citizenPass = await hashPassword('CitizenDemo2026!');
    const citizen = await User.create({
      email: 'citizen.demo@example.com',
      passwordHash: citizenPass,
      role: 'citizen'
    });

    logger.info('Seeding confidential reports (demonstrating zero submitter identity in report model)...');

    // Known tracking secrets for the demo reports
    // Demo report 1: Student concern (linked to citizen demo user via UserVault)
    const secret1 = 'sec_demo_student_grade_dispute_948123';
    const report1 = await Report.create({
      reference: 'UNS-STUD-2026-A1B2',
      category: 'Unfair treatment',
      description:
        'Following course midterm feedback highlighting inconsistent lab schedules, our group was assigned arbitrary deductions without rubric explanation. The course instructor verbally stated that critical students would be scrutinized during lab vivas. I am requesting a neutral panel reassessment of lab assignments.',
      incidentDate: 'October 2026',
      departmentOrLocation: 'Faculty of Computer Engineering - Lab 304',
      requestedResolution: 'Secondary assessment of viva evaluation rubrics by independent faculty.',
      status: 'Under review',
      priority: 'Standard',
      trackingSecretHash: hashTrackingSecret(secret1),
      timeline: [
        {
          status: 'Submitted',
          note: 'Report securely registered with zero submitter identity linkage.',
          updatedByRole: 'System',
          timestamp: new Date(Date.now() - 3 * 86400000)
        },
        {
          status: 'Under review',
          note: 'Assigned to Academic Welfare Committee for rubric compliance check.',
          updatedByRole: 'Reviewer',
          timestamp: new Date(Date.now() - 1 * 86400000)
        }
      ],
      reviewerResponses: [
        {
          message:
            'The Academic Welfare Office has acknowledged receipt of this report. We have initiated a blind curriculum review of Section B lab grading sheets. The course instructor will not be informed of individual concerns.',
          roleLabel: 'Academic Ombudsperson',
          timestamp: new Date(Date.now() - 1 * 86400000)
        }
      ]
    });

    // Link report 1 to citizen demo user in UserVault
    await UserVault.create({
      userId: citizen._id,
      reportReference: report1.reference,
      category: report1.category,
      submittedAt: report1.createdAt
    });

    // Demo report 2: Administrative inconvenience (linked to citizen)
    const secret2 = 'sec_demo_admin_transcript_delay_382914';
    const report2 = await Report.create({
      reference: 'UNS-ADMN-2026-F4C9',
      category: 'Administrative inconvenience',
      description:
        'Official transcript requests submitted six weeks ago have not been dispatched. Administrative staff at the registrar desk require in-person attendance during working hours despite previous payment of express dispatch fees.',
      incidentDate: 'September - October 2026',
      departmentOrLocation: 'Office of Student Records & Registrar',
      requestedResolution: 'Standardized digital credential issuance or postal dispatch tracking.',
      status: 'Action required',
      priority: 'Standard',
      trackingSecretHash: hashTrackingSecret(secret2),
      timeline: [
        {
          status: 'Submitted',
          note: 'Report securely registered with zero submitter identity linkage.',
          updatedByRole: 'System',
          timestamp: new Date(Date.now() - 5 * 86400000)
        },
        {
          status: 'Action required',
          note: 'Registrar dispatch logs flagged for backlog clearance.',
          updatedByRole: 'Reviewer',
          timestamp: new Date(Date.now() - 2 * 86400000)
        }
      ],
      reviewerResponses: [
        {
          message:
            'The registrar supervisor has been notified of the digital transcript dispatch backlog. A batch printing and courier pickup has been scheduled for Friday.',
          roleLabel: 'Administrative Service Oversight',
          timestamp: new Date(Date.now() - 2 * 86400000)
        }
      ]
    });

    await UserVault.create({
      userId: citizen._id,
      reportReference: report2.reference,
      category: report2.category,
      submittedAt: report2.createdAt
    });

    // Demo report 3: Public service delay (Unlinked anonymous report - purely tracked via secret)
    const secret3 = 'sec_demo_public_service_delay_771829';
    await Report.create({
      reference: 'UNS-PUBL-2026-D8E3',
      category: 'Public-service delay',
      description:
        'Municipal water supply connection transfer request (Ref: MCW-9021) has exceeded the 21-day citizen charter commitment by more than 40 days. Routine visits to ward office encounter closed windows and informal agents asking for facilitation fees.',
      incidentDate: 'August - October 2026',
      departmentOrLocation: 'Ward 12 Municipal Water Board',
      requestedResolution: 'Inspection order and adherence to published citizen charter turnaround.',
      status: 'Submitted',
      priority: 'Urgent',
      trackingSecretHash: hashTrackingSecret(secret3),
      timeline: [
        {
          status: 'Submitted',
          note: 'Report securely registered with zero submitter identity linkage.',
          updatedByRole: 'System',
          timestamp: new Date(Date.now() - 1 * 86400000)
        }
      ]
    });

    // Demo report 4: Privacy concern (Resolved)
    const secret4 = 'sec_demo_privacy_leak_662819';
    await Report.create({
      reference: 'UNS-PRIV-2026-K9L0',
      category: 'Privacy concern',
      description:
        'A shared department noticeboard recently posted a printed spreadsheet containing full student names alongside internal scholarship financial need bracket scores. This information is confidential and should not be publicly accessible.',
      incidentDate: 'Early October 2026',
      departmentOrLocation: 'Building C Main Hallway Notice Board',
      requestedResolution: 'Immediate removal of printed sheet and electronic distribution only.',
      status: 'Resolved',
      priority: 'Urgent',
      trackingSecretHash: hashTrackingSecret(secret4),
      timeline: [
        {
          status: 'Submitted',
          note: 'Report securely registered.',
          updatedByRole: 'System',
          timestamp: new Date(Date.now() - 7 * 86400000)
        },
        {
          status: 'Under review',
          note: 'Notified department building supervisor.',
          updatedByRole: 'Reviewer',
          timestamp: new Date(Date.now() - 6 * 86400000)
        },
        {
          status: 'Resolved',
          note: 'Sheet removed. Privacy advisory issued to department staff.',
          updatedByRole: 'Reviewer',
          timestamp: new Date(Date.now() - 4 * 86400000)
        }
      ],
      reviewerResponses: [
        {
          message:
            'The notice was taken down within two hours of this notification. A formal reminder has been circulated to all departmental assistants regarding confidential data handling.',
          roleLabel: 'Data Protection Officer',
          timestamp: new Date(Date.now() - 4 * 86400000)
        }
      ]
    });

    logger.info('Seeding initial audit logs...');
    await AuditLog.create([
      {
        action: 'SYSTEM_BOOTSTRAP',
        actorRole: 'System',
        details: 'System initialized with demo dataset.',
        status: 'SUCCESS'
      },
      {
        action: 'REPORT_SUBMITTED',
        actorRole: 'Citizen',
        reference: report1.reference,
        details: 'Confidential report submitted in Unfair treatment category.',
        status: 'SUCCESS'
      }
    ]);

    logger.info('=============================================');
    logger.info('DEMO DATA SEEDED SUCCESSFULLY!');
    logger.info('Credentials for testing:');
    logger.info('  Admin:     admin@unseen.internal      / AdminSecure2026!');
    logger.info('  Reviewer:  ombuds@unseen.internal     / ReviewerPass2026!');
    logger.info('  Reviewer:  ethics@unseen.internal     / ReviewerPass2026!');
    logger.info('  Citizen:   citizen.demo@example.com   / CitizenDemo2026!');
    logger.info('Demo Tracking Secret for Report UNS-STUD-2026-A1B2:');
    logger.info(`  ${secret1}`);
    logger.info('Demo Tracking Secret for Report UNS-PUBL-2026-D8E3:');
    logger.info(`  ${secret3}`);
    logger.info('=============================================');

    await disconnectDB();
    process.exit(0);
  } catch (err) {
    logger.error('Error seeding data:', err);
    await disconnectDB();
    process.exit(1);
  }
}

seedData();
