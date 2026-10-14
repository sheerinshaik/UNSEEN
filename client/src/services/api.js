const API_BASE = '/api';

export async function apiFetch(endpoint, options = {}) {
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    credentials: 'include' // Always send and receive HTTP-only session cookies
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data?.error || `Request failed with status ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.details = data?.details;
      throw err;
    }

    return data;
  } catch (error) {
    if (!error.status) {
      error.message = 'Network error or UNSEEN server unavailable. Please ensure backend is running.';
    }
    throw error;
  }
}

export const api = {
  // Authentication
  auth: {
    register: (credentials) => apiFetch('/auth/register', { method: 'POST', body: credentials }),
    login: (credentials) => apiFetch('/auth/login', { method: 'POST', body: credentials }),
    logout: () => apiFetch('/auth/logout', { method: 'POST' }),
    getMe: () => apiFetch('/auth/me')
  },

  // Reports
  reports: {
    getCategories: () => apiFetch('/reports/categories'),
    getDisclosureSummary: () => apiFetch('/reports/disclosure-summary'),
    submit: (reportData) => apiFetch('/reports/submit', { method: 'POST', body: reportData }),
    track: (credentials) => apiFetch('/reports/track', { method: 'POST', body: credentials }),
    getMyReports: () => apiFetch('/reports/my-reports')
  },

  // Reviewer Workflow
  reviewer: {
    getOverview: () => apiFetch('/reviewer/overview'),
    getReports: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return apiFetch(`/reviewer/reports${query ? `?${query}` : ''}`);
    },
    getReport: (reference) => apiFetch(`/reviewer/reports/${reference}`),
    updateStatus: (reference, status, note) =>
      apiFetch(`/reviewer/reports/${reference}/status`, {
        method: 'PATCH',
        body: { status, note }
      }),
    addResponse: (reference, message, roleLabel) =>
      apiFetch(`/reviewer/reports/${reference}/responses`, {
        method: 'POST',
        body: { message, roleLabel }
      })
  },

  // Restricted Admin
  admin: {
    getOverview: () => apiFetch('/admin/overview'),
    getReviewers: () => apiFetch('/admin/reviewers'),
    createReviewer: (data) => apiFetch('/admin/reviewers', { method: 'POST', body: data }),
    toggleReviewerStatus: (id) => apiFetch(`/admin/reviewers/${id}/toggle-status`, { method: 'PATCH' }),
    getAuditLogs: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return apiFetch(`/admin/audit-logs${query ? `?${query}` : ''}`);
    },
    getCategories: () => apiFetch('/admin/categories'),
    updateCategories: (categories) => apiFetch('/admin/categories', { method: 'PUT', body: { categories } })
  },

  // Demonstration Scenarios & Selective Disclosure
  demo: {
    getScenarios: () => apiFetch('/demo/scenarios'),
    testSelectiveDisclosure: (attributeType, testValue) =>
      apiFetch('/demo/selective-disclosure', {
        method: 'POST',
        body: { attributeType, testValue }
      })
  },

  // Health
  health: {
    check: () => apiFetch('/health')
  }
};
