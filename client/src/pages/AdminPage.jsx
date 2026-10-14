import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { Modal } from '../components/Modal.jsx';
import {
  ShieldAlert,
  UserPlus,
  Users,
  Settings,
  Activity,
  CheckCircle,
  XCircle,
  EyeOff,
  AlertTriangle,
  Lock
} from 'lucide-react';

export function AdminPage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();

  // Tabs: 'reviewers' | 'categories' | 'audit_logs'
  const [activeTab, setActiveTab] = useState('reviewers');

  // Stats
  const [stats, setStats] = useState(null);
  const [reviewers, setReviewers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // New reviewer modal & form
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newDepartment, setNewDepartment] = useState('Academic Welfare');
  const [provisioning, setProvisioning] = useState(false);

  // Category editor
  const [newCategoryName, setNewCategoryName] = useState('');
  const [savingCategories, setSavingCategories] = useState(false);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [overviewRes, reviewersRes, categoriesRes, logsRes] = await Promise.all([
        api.admin.getOverview(),
        api.admin.getReviewers(),
        api.admin.getCategories(),
        api.admin.getAuditLogs({ limit: 40 })
      ]);

      if (overviewRes.stats) setStats(overviewRes.stats);
      if (reviewersRes.reviewers) setReviewers(reviewersRes.reviewers);
      if (categoriesRes.categories) setCategories(categoriesRes.categories);
      if (logsRes.logs) setAuditLogs(logsRes.logs);
    } catch (err) {
      showError(err.message || 'Failed to load administration controls.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleCreateReviewer = async (e) => {
    e.preventDefault();
    try {
      setProvisioning(true);
      const res = await api.admin.createReviewer({
        email: newEmail.trim(),
        password: newPassword,
        department: newDepartment.trim()
      });

      if (res.success) {
        showSuccess(`Reviewer account provisioned for ${newEmail}`);
        setIsProvisionModalOpen(false);
        setNewEmail('');
        setNewPassword('');
        loadAdminData();
      }
    } catch (err) {
      showError(err.message || 'Failed to provision reviewer.');
    } finally {
      setProvisioning(false);
    }
  };

  const handleToggleStatus = async (id, email) => {
    try {
      const res = await api.admin.toggleReviewerStatus(id);
      if (res.success) {
        showSuccess(res.message);
        loadAdminData();
      }
    } catch (err) {
      showError(err.message || 'Status toggle failed.');
    }
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    if (categories.includes(newCategoryName.trim())) {
      showError('Category already exists.');
      return;
    }
    setCategories([...categories, newCategoryName.trim()]);
    setNewCategoryName('');
  };

  const handleRemoveCategory = (cat) => {
    setCategories(categories.filter((c) => c !== cat));
  };

  const handleSaveCategories = async () => {
    try {
      setSavingCategories(true);
      const res = await api.admin.updateCategories(categories);
      if (res.success) {
        showSuccess('Categories successfully updated across the platform.');
      }
    } catch (err) {
      showError(err.message || 'Failed to save categories.');
    } finally {
      setSavingCategories(false);
    }
  };

  return (
    <div className="section-sm">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-teal)', fontWeight: 700, fontSize: '0.8125rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            <Lock size={16} /> Restricted Administration Center
          </div>
          <h1 style={{ fontSize: '1.875rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
            Governance & Reviewer Provisioning
          </h1>
          <p style={{ color: 'var(--color-slate)', fontSize: '0.9375rem' }}>
            Manage staff credentials, configure reporting taxonomy, and inspect tamper-evident audit trails.
          </p>
        </div>

        {/* Strong Least-Privilege Architecture Warning */}
        <div
          className="alert alert-info"
          style={{
            backgroundColor: '#F0F7F6',
            border: '1.5px solid var(--color-mint)',
            marginBottom: '2rem',
            padding: '1.25rem'
          }}
        >
          <EyeOff size={22} color="var(--color-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: 'var(--color-navy)', fontSize: '0.9375rem' }}>
              Enforced Least-Privilege Boundary
            </strong>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-navy)', marginTop: '0.25rem', lineHeight: 1.5 }}>
              In accordance with UNSEEN's privacy specification (Section 6 & 9), administrators cannot view citizen passwords, access private tracking secrets, or query identity-to-report mappings. Citizen accounts are omitted from administrative dashboards to prevent identity harvesting.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        {stats && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem'
            }}
          >
            <div className="card">
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-slate)' }}>STAFF REVIEWERS</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-teal)', marginTop: '0.25rem' }}>
                {stats.reviewers}
              </div>
            </div>
            <div className="card">
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-slate)' }}>ADMINISTRATORS</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-navy)', marginTop: '0.25rem' }}>
                {stats.admins}
              </div>
            </div>
            <div className="card">
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-slate)' }}>AUDIT TRAIL LOGS</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-navy)', marginTop: '0.25rem' }}>
                {stats.auditLogsTotal}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1.75rem' }}>
          <button
            onClick={() => setActiveTab('reviewers')}
            className={`btn btn-sm ${activeTab === 'reviewers' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '0', borderBottom: activeTab === 'reviewers' ? '2px solid var(--color-teal)' : 'none' }}
          >
            <Users size={16} /> Reviewer Accounts
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`btn btn-sm ${activeTab === 'categories' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '0', borderBottom: activeTab === 'categories' ? '2px solid var(--color-teal)' : 'none' }}
          >
            <Settings size={16} /> Category Taxonomy
          </button>
          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`btn btn-sm ${activeTab === 'audit_logs' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '0', borderBottom: activeTab === 'audit_logs' ? '2px solid var(--color-teal)' : 'none' }}
          >
            <Activity size={16} /> Security Audit Logs
          </button>
        </div>

        {/* TAB 1: REVIEWERS */}
        {activeTab === 'reviewers' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem' }}>Authorized Reviewer Staff</h2>
              <button onClick={() => setIsProvisionModalOpen(true)} className="btn btn-primary btn-sm">
                <UserPlus size={16} /> Provision New Reviewer
              </button>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Assigned Department</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th style={{ textAlign: 'right' }}>Account State</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewers.map((r) => (
                    <tr key={r._id || r.email}>
                      <td style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{r.email}</td>
                      <td>
                        <span style={{ textTransform: 'capitalize', fontWeight: 600, color: r.role === 'admin' ? 'var(--color-navy)' : 'var(--color-teal)' }}>
                          {r.role}
                        </span>
                      </td>
                      <td>{r.department || 'General'}</td>
                      <td>
                        <span style={{ color: r.isActive ? 'var(--color-teal)' : 'var(--color-red)', fontWeight: 600 }}>
                          {r.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td style={{ textAlign: 'right' }}>
                        {r.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleStatus(r._id, r.email)}
                            className="btn btn-secondary btn-sm"
                          >
                            {r.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CATEGORY TAXONOMY */}
        {activeTab === 'categories' && (
          <div className="card" style={{ maxWidth: '680px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Configurable Reporting Categories</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-slate)', marginBottom: '1.5rem' }}>
              Add or remove categories without code refactoring. Changes take effect immediately in the reporting wizard.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="New category name (e.g. Environmental Hazard)"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <button type="button" onClick={handleAddCategory} className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
                Add Category
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
              {categories.map((cat) => (
                <div
                  key={cat}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.625rem 0.875rem',
                    backgroundColor: 'var(--color-ivory)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '0.9375rem' }}>{cat}</span>
                  <button
                    onClick={() => handleRemoveCategory(cat)}
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--color-red)' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleSaveCategories}
              disabled={savingCategories}
              className="btn btn-primary"
            >
              {savingCategories ? 'Saving Changes...' : 'Save Category Configuration'}
            </button>
          </div>
        )}

        {/* TAB 3: AUDIT LOGS */}
        {activeTab === 'audit_logs' && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Security & Operational Audit Events</h2>
              <p style={{ color: 'var(--color-slate)', fontSize: '0.875rem' }}>
                Automated audit events logged without storing passwords, session tokens, or report text.
              </p>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Action</th>
                    <th>Actor Role</th>
                    <th>Reference</th>
                    <th>Status</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log._id}>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--color-slate)' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--color-navy)' }}>
                        {log.action}
                      </td>
                      <td>{log.actorRole}</td>
                      <td>{log.reference || '—'}</td>
                      <td>
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            color: log.status === 'SUCCESS' ? 'var(--color-teal)' : 'var(--color-red)'
                          }}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--color-slate)' }}>{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PROVISION REVIEWER MODAL */}
        {isProvisionModalOpen && (
          <Modal
            isOpen={isProvisionModalOpen}
            onClose={() => setIsProvisionModalOpen(false)}
            title="Provision Reviewer Account"
            maxWidth="500px"
          >
            <form onSubmit={handleCreateReviewer}>
              <div className="form-group">
                <label className="form-label" htmlFor="provEmail">
                  Staff Email Address
                </label>
                <input
                  id="provEmail"
                  type="email"
                  className="form-input"
                  placeholder="reviewer@institution.internal"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="provDept">
                  Department / Jurisdiction
                </label>
                <input
                  id="provDept"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Student Grievance, Academic Welfare, Ethics"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="provPass">
                  Temporary Password
                </label>
                <input
                  id="provPass"
                  type="password"
                  className="form-input"
                  placeholder="Minimum 8 characters with upper, lower, number"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsProvisionModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={provisioning}
                  className="btn btn-primary"
                >
                  {provisioning ? 'Creating Account...' : 'Provision Reviewer'}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
}
