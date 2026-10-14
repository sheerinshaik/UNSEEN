import { Router } from 'express';

const router = Router();

/**
 * GET /api/demo/scenarios
 * Returns the two synthetic demonstration scenarios with disclaimers
 */
router.get('/scenarios', (req, res) => {
  return res.status(200).json({
    success: true,
    disclaimer:
      'UNSEEN is an independent demonstration platform and is not connected to government grievance systems or official identity databases. Submitting a report here does not file an official complaint.',
    scenarios: [
      {
        id: 'student-treatment',
        title: 'Student Unfair Treatment Scenario',
        persona: 'Undergraduate Engineering Student (Pseudonymous Submitter)',
        category: 'Unfair treatment',
        issueSummary:
          'Repeated subjective grading discrepancies and targeted comments following a course feedback survey.',
        sampleDescription:
          'Following an anonymous midterm course review where several students highlighted inadequate lecture preparation, our section was subjected to sudden surprise quizzes worth 30% of total grade. During office hours, the instructor explicitly referenced the critical survey comments and informed me that my final project grade would reflect my "attitude". I seek an independent second review of project evaluation rubrics across sections without creating academic retaliation risks.',
        departmentOrLocation: 'Department of Electrical & Computer Engineering',
        requestedResolution:
          'An independent secondary review of project code evaluations by an unassociated faculty committee.',
        workflowDemonstration: {
          step1: 'Student signs in via UNSEEN pseudonymous session.',
          step2: 'Student drafts narrative with automatic warning to omit room numbers or faculty personal names.',
          step3: 'Student reviews information disclosure: Account ID and email are 100% stripped.',
          step4: 'Case is reviewed by Academic Ombudsperson without student identity revealed.',
          step5: 'Ombudsperson issues resolution plan via private response channel.'
        }
      },
      {
        id: 'public-service-delay',
        title: 'Public-Service Delay Scenario',
        persona: 'Citizen Applicant (Pseudonymous Submitter)',
        category: 'Public-service delay',
        issueSummary:
          'Unexplained 12-week procedural delay in municipal trade license renewal despite all documentation being submitted on schedule.',
        sampleDescription:
          'Application for commercial license renewal was logged under standard 14-day service commitment. Over 85 days have elapsed without inspection scheduling or status updates. Counter inquiries result in informal requests for expedited processing fees. I am reporting the systemic delay and lack of procedural tracking to ensure supervisory oversight without exposing my commercial premise to punitive inspections.',
        departmentOrLocation: 'Municipal Licensing & Ward Regulatory Office #4',
        requestedResolution:
          'Audit of pending application queue and adherence to statutory turnaround timelines.',
        workflowDemonstration: {
          step1: 'Citizen submits issue under Public-service delay category.',
          step2: 'Public service disclaimer displayed: not an official court or ombudsman writ.',
          step3: 'Submission generates random reference and private tracking secret.',
          step4: 'Supervisory officer reviews delay metrics and notes file status.',
          step5: 'Citizen tracks status privately without administrative retaliation.'
        }
      }
    ]
  });
});

/**
 * POST /api/demo/selective-disclosure
 * Simulates selective disclosure / zero-knowledge attribute verification
 * Strictly synthetic - never accepts real credentials or sensitive IDs.
 */
router.post('/selective-disclosure', (req, res) => {
  const { attributeType, testValue } = req.body;

  let result = {};

  switch (attributeType) {
    case 'student_status': {
      // Simulate verifying enrolled student status without disclosing student ID or name
      const isEnrolled = testValue !== 'invalid_id';
      result = {
        attribute: 'Active Student Enrollment',
        proofSatisfied: isEnrolled,
        proofType: 'Attribute Membership Proof (Simulated)',
        verifiedClaims: {
          isCurrentlyEnrolled: isEnrolled,
          institutionAccredited: true
        },
        concealedAttributes: [
          'Submitter Full Name',
          'Student Registration ID',
          'Grade Point Average (GPA)',
          'Residential Address'
        ]
      };
      break;
    }
    case 'age_threshold': {
      // Simulate verifying age >= 18 without revealing Date of Birth
      const birthYear = parseInt(testValue, 10);
      const currentYear = new Date().getFullYear();
      const meetsThreshold = !isNaN(birthYear) && currentYear - birthYear >= 18;
      result = {
        attribute: 'Legal Majority Age (>= 18 years)',
        proofSatisfied: meetsThreshold,
        proofType: 'Range Proof (Simulated)',
        verifiedClaims: {
          isAtLeast18: meetsThreshold
        },
        concealedAttributes: [
          'Exact Date of Birth',
          'Birthplace Location',
          'National Identity Number (Aadhaar/SSN)'
        ]
      };
      break;
    }
    case 'department_membership': {
      // Simulate verifying employee/student is in target faculty without revealing job title or employee #
      const isValidDept = ['Engineering', 'Sciences', 'Humanities', 'Administration'].includes(testValue);
      result = {
        attribute: 'Authorized Department Affiliate',
        proofSatisfied: isValidDept,
        proofType: 'Cryptographic Group Membership (Simulated)',
        verifiedClaims: {
          isAffiliatedWithInstitution: isValidDept,
          departmentScopeValid: isValidDept
        },
        concealedAttributes: [
          'Employee Payroll Number',
          'Direct Supervisor Name',
          'Performance Appraisal Records'
        ]
      };
      break;
    }
    default:
      return res.status(400).json({
        success: false,
        error: 'Unsupported demonstration attribute type. Choose: student_status, age_threshold, or department_membership.'
      });
  }

  return res.status(200).json({
    success: true,
    isSimulatedDemonstration: true,
    notice:
      'This is an educational synthetic simulation demonstrating the principle of selective disclosure. No external identity databases or government registries are queried. UNSEEN does not collect or process national identity documents.',
    verificationResult: result
  });
});

export default router;
