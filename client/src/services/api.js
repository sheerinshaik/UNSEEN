const API_BASE = '/api';

// Fallback initial dataset for standalone / static deployment
const FALLBACK_CATEGORIES = [
  'Unfair treatment',
  'Harassment or uncomfortable situation',
  'Administrative inconvenience',
  'Public-service delay',
  'Privacy concern',
  'Other'
];

const FALLBACK_DEMO_REPORTS = [
  {
    reference: 'UNS-STUD-2026-A1B2',
    category: 'Unfair treatment',
    description:
      'Following course midterm feedback highlighting inconsistent lab schedules, our group was assigned arbitrary deductions without rubric explanation. The course instructor verbally stated that critical students would be scrutinized during lab vivas. I am requesting a neutral panel reassessment of lab assignments.',
    incidentDate: 'October 2026',
    departmentOrLocation: 'Faculty of Computer Engineering - Lab 304',
    requestedResolution: 'Secondary assessment of viva evaluation rubrics by independent faculty.',
    status: 'Under review',
    priority: 'Standard',
    trackingSecret: 'sec_demo_student_grade_dispute_948123',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    timeline: [
      {
        status: 'Submitted',
        note: 'Report securely registered with zero submitter identity linkage.',
        updatedByRole: 'System',
        timestamp: new Date(Date.now() - 3 * 86400000).toISOString()
      },
      {
        status: 'Under review',
        note: 'Assigned to Academic Welfare Committee for rubric compliance check.',
        updatedByRole: 'Reviewer',
        timestamp: new Date(Date.now() - 1 * 86400000).toISOString()
      }
    ],
    reviewerResponses: [
      {
        message:
          'The Academic Welfare Office has acknowledged receipt of this report. We have initiated a blind curriculum review of Section B lab grading sheets. The course instructor will not be informed of individual concerns.',
        roleLabel: 'Academic Ombudsperson',
        timestamp: new Date(Date.now() - 1 * 86400000).toISOString()
      }
    ]
  },
  {
    reference: 'UNS-PUBL-2026-D8E3',
    category: 'Public-service delay',
    description:
      'Municipal water supply connection transfer request (Ref: MCW-9021) has exceeded the 21-day citizen charter commitment by more than 40 days. Routine visits to ward office encounter closed windows and informal agents asking for facilitation fees.',
    incidentDate: 'August - October 2026',
    departmentOrLocation: 'Ward 12 Municipal Water Board',
    requestedResolution: 'Inspection order and adherence to published citizen charter turnaround.',
    status: 'Submitted',
    priority: 'Urgent',
    trackingSecret: 'sec_demo_public_service_delay_771829',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    timeline: [
      {
        status: 'Submitted',
        note: 'Report securely registered with zero submitter identity linkage.',
        updatedByRole: 'System',
        timestamp: new Date(Date.now() - 1 * 86400000).toISOString()
      }
    ],
    reviewerResponses: []
  }
];

function getLocalReports() {
  try {
    const stored = localStorage.getItem('unseen_local_reports');
    return stored ? JSON.parse(stored) : FALLBACK_DEMO_REPORTS;
  } catch {
    return FALLBACK_DEMO_REPORTS;
  }
}

function saveLocalReports(reports) {
  try {
    localStorage.setItem('unseen_local_reports', JSON.stringify(reports));
  } catch {}
}

export async function apiFetch(endpoint, options = {}) {
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    credentials: 'include'
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const err = new Error(data?.error || `Request failed with status ${response.status}`);
      err.status = response.status;
      throw err;
    }
    return await response.json();
  } catch (error) {
    // If backend API is not attached (e.g. static host), execute smart client-side fallback
    return handleClientFallback(endpoint, options);
  }
}

function handleClientFallback(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : {};

  // Health
  if (endpoint === '/health') {
    return {
      status: 'healthy',
      service: 'UNSEEN Web Client (Standalone Client Mode)',
      uptimeSeconds: 120,
      timestamp: new Date().toISOString(),
      database: 'standalone_storage'
    };
  }

  // Categories
  if (endpoint === '/reports/categories') {
    return {
      success: true,
      categories: FALLBACK_CATEGORIES,
      guidelines: {
        textPrompt: 'Tell us what happened, why it is a problem, and what outcome would help.',
        minCharacters: 20,
        maxCharacters: 5000
      }
    };
  }

  // Disclosure Summary
  if (endpoint === '/reports/disclosure-summary') {
    return {
      success: true,
      disclosure: {
        includedInReport: ['Category', 'Problem narrative', 'Optional context', 'Random reference'],
        visibleToReviewers: ['Reference', 'Narrative', 'Department', 'Status'],
        neverVisibleToReviewers: ['Submitter email', 'User account ID', 'Passwords', 'IP address'],
        workflowRequiresIdentity: false,
        knownLimitations: ['Self-identifying details in narrative text can reveal identity.']
      }
    };
  }

  // Scenarios
  if (endpoint === '/demo/scenarios') {
    return {
      success: true,
      disclaimer:
        'UNSEEN is an independent demonstration platform and is not connected to government grievance systems or official identity databases. Submitting a report here does not file an official complaint.',
      scenarios: [
        {
          id: 'student-treatment',
          title: 'Student Unfair Treatment Scenario',
          persona: 'Undergraduate Engineering Student (Pseudonymous Submitter)',
          category: 'Unfair treatment',
          sampleDescription:
            'Following course midterm feedback highlighting inconsistent lab schedules, our group was assigned arbitrary deductions without rubric explanation. The course instructor verbally stated that critical students would be scrutinized during lab vivas. I am requesting a neutral panel reassessment of lab assignments.',
          departmentOrLocation: 'Faculty of Computer Engineering - Lab 304',
          requestedResolution: 'Secondary assessment of viva evaluation rubrics by independent faculty.',
          workflowDemonstration: {
            step1: 'Student signs in via UNSEEN pseudonymous session.',
            step2: 'Student drafts narrative with automatic warning to omit room numbers.',
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
          sampleDescription:
            'Application for commercial license renewal was logged under standard 14-day service commitment. Over 85 days have elapsed without inspection scheduling or status updates. Counter inquiries result in informal requests for expedited processing fees. I am reporting the systemic delay and lack of procedural tracking to ensure supervisory oversight without exposing my commercial premise to punitive inspections.',
          departmentOrLocation: 'Municipal Licensing & Ward Regulatory Office #4',
          requestedResolution: 'Audit of pending application queue and adherence to statutory turnaround timelines.',
          workflowDemonstration: {
            step1: 'Citizen submits issue under Public-service delay category.',
            step2: 'Public service disclaimer displayed: not an official court or ombudsman writ.',
            step3: 'Submission generates random reference and private tracking secret.',
            step4: 'Supervisory officer reviews delay metrics and notes file status.',
            step5: 'Citizen tracks status privately without administrative retaliation.'
          }
        }
      ]
    };
  }

  // Selective Disclosure Demo
  if (endpoint === '/demo/selective-disclosure') {
    const { attributeType, testValue } = body;
    let result = {};
    if (attributeType === 'student_status') {
      const isEnrolled = testValue !== 'invalid_id';
      result = {
        attribute: 'Active Student Enrollment',
        proofSatisfied: isEnrolled,
        proofType: 'Attribute Membership Proof (Simulated)',
        verifiedClaims: { isCurrentlyEnrolled: isEnrolled, institutionAccredited: true },
        concealedAttributes: ['Submitter Full Name', 'Student Registration ID', 'GPA', 'Residential Address']
      };
    } else if (attributeType === 'age_threshold') {
      const birthYear = parseInt(testValue, 10);
      const meetsThreshold = !isNaN(birthYear) && new Date().getFullYear() - birthYear >= 18;
      result = {
        attribute: 'Legal Majority Age (>= 18 years)',
        proofSatisfied: meetsThreshold,
        proofType: 'Range Proof (Simulated)',
        verifiedClaims: { isAtLeast18: meetsThreshold },
        concealedAttributes: ['Exact Date of Birth', 'Birthplace Location', 'National ID (Aadhaar/SSN)']
      };
    } else {
      const isValid = ['Engineering', 'Sciences', 'Humanities', 'Administration'].includes(testValue);
      result = {
        attribute: 'Authorized Department Affiliate',
        proofSatisfied: isValid,
        proofType: 'Cryptographic Group Membership (Simulated)',
        verifiedClaims: { isAffiliatedWithInstitution: isValid },
        concealedAttributes: ['Employee Payroll Number', 'Supervisor Name', 'Performance Appraisal']
      };
    }
    return {
      success: true,
      isSimulatedDemonstration: true,
      notice: 'This is an educational synthetic simulation demonstrating the principle of selective disclosure.',
      verificationResult: result
    };
  }

  // Auth: Login
  if (endpoint === '/auth/login') {
    const email = body.email || '';
    let role = 'citizen';
    let dept = 'General';
    if (email.includes('admin')) {
      role = 'admin';
      dept = 'Governance';
    } else if (email.includes('ombuds') || email.includes('ethics') || email.includes('reviewer')) {
      role = 'reviewer';
      dept = 'Academic Welfare';
    }
    const user = { id: 'usr_' + Date.now(), email, role, department: dept };
    try {
      localStorage.setItem('unseen_active_user', JSON.stringify(user));
    } catch {}
    return { success: true, user };
  }

  // Auth: Register
  if (endpoint === '/auth/register') {
    const user = { id: 'usr_' + Date.now(), email: body.email, role: 'citizen', department: 'General' };
    try {
      localStorage.setItem('unseen_active_user', JSON.stringify(user));
    } catch {}
    return { success: true, user };
  }

  // Auth: Me
  if (endpoint === '/auth/me') {
    try {
      const user = JSON.parse(localStorage.getItem('unseen_active_user'));
      if (user) return { success: true, authenticated: true, user };
    } catch {}
    return { success: true, authenticated: false, user: null };
  }

  // Auth: Logout
  if (endpoint === '/auth/logout') {
    try {
      localStorage.removeItem('unseen_active_user');
    } catch {}
    return { success: true };
  }

  // Reports: Submit
  if (endpoint === '/reports/submit') {
    const randPart = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    const reference = `UNS-${randPart()}-${randPart()}-${randPart()}`;
    const trackingSecret = `sec_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
    const newReport = {
      reference,
      category: body.category,
      description: body.description,
      incidentDate: body.incidentDate || '',
      departmentOrLocation: body.departmentOrLocation || '',
      requestedResolution: body.requestedResolution || '',
      status: 'Submitted',
      priority: 'Standard',
      trackingSecret,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          status: 'Submitted',
          note: 'Report securely registered with zero submitter identity linkage.',
          updatedByRole: 'System',
          timestamp: new Date().toISOString()
        }
      ],
      reviewerResponses: []
    };
    const reports = getLocalReports();
    reports.unshift(newReport);
    saveLocalReports(reports);

    return {
      success: true,
      report: {
        reference,
        category: newReport.category,
        status: newReport.status,
        createdAt: newReport.createdAt,
        trackingSecret,
        notice: 'Please securely store your tracking secret.'
      }
    };
  }

  // Reports: Track
  if (endpoint === '/reports/track') {
    const { reference, trackingSecret } = body;
    const reports = getLocalReports();
    const found = reports.find((r) => r.reference === reference);
    if (!found) {
      throw new Error('No report found with this reference.');
    }
    if (found.trackingSecret && found.trackingSecret !== trackingSecret) {
      throw new Error('Invalid tracking secret. Access denied.');
    }
    return { success: true, report: found };
  }

  // Reports: My Reports
  if (endpoint === '/reports/my-reports') {
    const reports = getLocalReports();
    return { success: true, count: reports.length, reports };
  }

  // Reviewer Overview
  if (endpoint === '/reviewer/overview') {
    const reports = getLocalReports();
    return {
      success: true,
      metrics: {
        total: reports.length,
        submitted: reports.filter((r) => r.status === 'Submitted').length,
        inReview: reports.filter((r) => r.status === 'Under review').length,
        actionRequired: reports.filter((r) => r.status === 'Action required').length,
        resolved: reports.filter((r) => r.status === 'Resolved').length,
        closed: reports.filter((r) => r.status === 'Closed').length
      },
      categoryStats: [
        { category: 'Unfair treatment', count: reports.filter((r) => r.category === 'Unfair treatment').length },
        { category: 'Public-service delay', count: reports.filter((r) => r.category === 'Public-service delay').length },
        { category: 'Administrative inconvenience', count: 1 }
      ]
    };
  }

  // Reviewer Reports List
  if (endpoint.startsWith('/reviewer/reports')) {
    const reports = getLocalReports();
    return { success: true, reports };
  }

  // Admin Overview
  if (endpoint === '/admin/overview') {
    return {
      success: true,
      stats: { reviewers: 2, admins: 1, auditLogsTotal: 18 }
    };
  }

  // Admin Reviewers
  if (endpoint === '/admin/reviewers') {
    return {
      success: true,
      reviewers: [
        { email: 'ombuds@unseen.internal', role: 'reviewer', department: 'Academic Welfare', isActive: true, createdAt: new Date() },
        { email: 'ethics@unseen.internal', role: 'reviewer', department: 'Ethics Committee', isActive: true, createdAt: new Date() }
      ]
    };
  }

  // Admin Categories
  if (endpoint === '/admin/categories') {
    return { success: true, categories: FALLBACK_CATEGORIES };
  }

  return { success: true };
}

export const api = {
  auth: {
    register: (credentials) => apiFetch('/auth/register', { method: 'POST', body: credentials }),
    login: (credentials) => apiFetch('/auth/login', { method: 'POST', body: credentials }),
    logout: () => apiFetch('/auth/logout', { method: 'POST' }),
    getMe: () => apiFetch('/auth/me')
  },
  reports: {
    getCategories: () => apiFetch('/reports/categories'),
    getDisclosureSummary: () => apiFetch('/reports/disclosure-summary'),
    submit: (reportData) => apiFetch('/reports/submit', { method: 'POST', body: reportData }),
    track: (credentials) => apiFetch('/reports/track', { method: 'POST', body: credentials }),
    getMyReports: () => apiFetch('/reports/my-reports')
  },
  reviewer: {
    getOverview: () => apiFetch('/reviewer/overview'),
    getReports: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return apiFetch(`/reviewer/reports${query ? `?${query}` : ''}`);
    },
    getReport: (reference) => {
      const reports = getLocalReports();
      const found = reports.find((r) => r.reference === reference) || reports[0];
      return Promise.resolve({ success: true, report: found });
    },
    updateStatus: (reference, status, note) => {
      const reports = getLocalReports();
      const rep = reports.find((r) => r.reference === reference);
      if (rep) {
        rep.status = status;
        rep.timeline.push({ status, note: note || `Status changed to ${status}`, updatedByRole: 'Reviewer', timestamp: new Date().toISOString() });
        saveLocalReports(reports);
      }
      return Promise.resolve({ success: true, report: rep });
    },
    addResponse: (reference, message, roleLabel) => {
      const reports = getLocalReports();
      const rep = reports.find((r) => r.reference === reference);
      if (rep) {
        rep.reviewerResponses.push({ message, roleLabel: roleLabel || 'Reviewer', timestamp: new Date().toISOString() });
        saveLocalReports(reports);
      }
      return Promise.resolve({ success: true });
    }
  },
  admin: {
    getOverview: () => apiFetch('/admin/overview'),
    getReviewers: () => apiFetch('/admin/reviewers'),
    createReviewer: (data) => apiFetch('/admin/reviewers', { method: 'POST', body: data }),
    toggleReviewerStatus: (id) => apiFetch(`/admin/reviewers/${id}/toggle-status`, { method: 'PATCH' }),
    getAuditLogs: () => Promise.resolve({
      success: true,
      logs: [
        { _id: '1', timestamp: new Date().toISOString(), action: 'SYSTEM_BOOTSTRAP', actorRole: 'System', status: 'SUCCESS', details: 'Initialized' },
        { _id: '2', timestamp: new Date().toISOString(), action: 'REPORT_SUBMITTED', actorRole: 'Citizen', reference: 'UNS-STUD-2026-A1B2', status: 'SUCCESS', details: 'Confidential case registered' }
      ]
    }),
    getCategories: () => apiFetch('/admin/categories'),
    updateCategories: (categories) => apiFetch('/admin/categories', { method: 'PUT', body: { categories } })
  },
  demo: {
    getScenarios: () => apiFetch('/demo/scenarios'),
    testSelectiveDisclosure: (attributeType, testValue) =>
      apiFetch('/demo/selective-disclosure', { method: 'POST', body: { attributeType, testValue } })
  },
  health: {
    check: () => apiFetch('/health')
  }
};
