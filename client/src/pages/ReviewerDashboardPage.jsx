import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { Modal } from '../components/Modal.jsx';
import {
  Inbox,
  Clock,
  CheckCircle,
  FileText,
  Search,
  Filter,
  ShieldAlert,
  Send,
  MessageSquare,
  EyeOff,
  Settings,
  Layers,
  BarChart3
} from 'lucide-react';

export function ReviewerDashboardPage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();

  // Navigation tab: 'overview' | 'incoming' | 'in_review' | 'resolved' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');

  // Metrics from DB
  const [metrics, setMetrics] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected Report & Modals
  const [selectedReport, setSelectedReport] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('Under review');
  const [statusNote, setStatusNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Response composer
  const [responseMsg, setResponseMsg] = useState('');
  const [roleLabel, setRoleLabel] = useState(user?.department ? `${user.department} Reviewer` : 'Authorized Reviewer');
  const [submittingResponse, setSubmittingResponse] = useState(false);

  // Load Overview Data
  const loadOverview = async () => {
    try {
      setLoading(true);
      const res = await api.reviewer.getOverview();
      if (res.metrics) {
        setMetrics(res.metrics);
        setCategoryStats(res.categoryStats || []);
      }
    } catch (err) {
      showError('Unable to load reviewer statistics.');
    } finally {
      setLoading(false);
    }
  };

  // Load Reports List
  const loadReports = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;

      if (activeTab === 'incoming') {
        params.status = 'Submitted';
      } else if (activeTab === 'in_review') {
        params.status = 'Under review';
      } else if (activeTab === 'resolved') {
        params.status = 'Resolved';
      } else if (statusFilter) {
        params.status = statusFilter;
      }

      const res = await api.reviewer.getReports(params);
      if (res.reports) {
        setReports(res.reports);
      }
    } catch (err) {
      showError('Unable to load reports queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'overview') {
      loadOverview();
    } else {
      loadReports();
    }
  }, [activeTab, statusFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadReports();
  };

  const handleOpenDetail = async (report) => {
    try {
      const res = await api.reviewer.getReport(report.reference);
      if (res.report) {
        setSelectedReport(res.report);
        setNewStatus(res.report.status);
      }
    } catch (err) {
      showError('Could not fetch report details.');
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;
    try {
      setUpdatingStatus(true);
      const res = await api.reviewer.updateStatus(selectedReport.reference, newStatus, statusNote);
      if (res.success && res.report) {
        setSelectedReport(res.report);
        showSuccess(`Report status updated to ${newStatus}.`);
        setIsUpdateModalOpen(false);
        setStatusNote('');
        loadReports();
        loadOverview();
      }
    } catch (err) {
      showError(err.message || 'Status update failed.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePostResponse = async (e) => {
    e.preventDefault();
    if (!responseMsg.trim() || !selectedReport) return;
    try {
      setSubmittingResponse(true);
      const res = await api.reviewer.addResponse(selectedReport.reference, responseMsg.trim(), roleLabel);
      if (res.success) {
        showSuccess('Official reviewer response published to submitter.');
        setResponseMsg('');
        // Refresh detail
        handleOpenDetail(selectedReport);
      }
    } catch (err) {
      showError(err.message || 'Failed to submit response.');
    } finally {
      setSubmittingResponse(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 4.25rem)' }}>
      {/* Compact Sidebar */}
      <aside
        style={{
          width: '240px',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid var(--color-border)',
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0
        }}
      >
        <div style={{ padding: '0 0.5rem 1.25rem', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-teal)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Reviewer Workspace
          </div>
          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-navy)', marginTop: '0.25rem' }}>
            {user?.department || 'Ethics Committee'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>{user?.email}</div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '1.25rem' }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ justifyContent: 'flex-start' }}
          >
            <BarChart3 size={16} /> Overview
          </button>
          <button
            onClick={() => setActiveTab('incoming')}
            className={`btn btn-sm ${activeTab === 'incoming' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ justifyContent: 'flex-start' }}
          >
            <Inbox size={16} /> Incoming Reports
          </button>
          <button
            onClick={() => setActiveTab('in_review')}
            className={`btn btn-sm ${activeTab === 'in_review' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ justifyContent: 'flex-start' }}
          >
            <Clock size={16} /> In Review
          </button>
          <button
            onClick={() => setActiveTab('resolved')}
            className={`btn btn-sm ${activeTab === 'resolved' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ justifyContent: 'flex-start' }}
          >
            <CheckCircle size={16} /> Resolved Cases
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`btn btn-sm ${activeTab === 'settings' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ justifyContent: 'flex-start' }}
          >
            <Settings size={16} /> Guidelines
          </button>
        </nav>

        {/* Privacy Boundary Badge */}
        <div
          style={{
            marginTop: 'auto',
            padding: '0.875rem',
            backgroundColor: 'var(--color-mint)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid #BFE2D5',
            fontSize: '0.75rem',
            color: 'var(--color-navy)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            <EyeOff size={14} color="var(--color-teal)" /> Identity Separation
          </div>
          <div>Reviewer accounts cannot view submitter email, names, or accounts.</div>
        </div>
      </aside>

      {/* Main Reviewer Content */}
      <main style={{ flex: 1, padding: '2rem', backgroundColor: 'var(--color-ivory)', overflowY: 'auto' }}>
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            <h1 style={{ fontSize: '1.625rem', marginBottom: '0.5rem' }}>Reviewer Operational Metrics</h1>
            <p style={{ color: 'var(--color-slate)', fontSize: '0.875rem', marginBottom: '2rem' }}>
              Real-time metrics computed directly from active database records.
            </p>

            {/* Metric Cards */}
            {metrics && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                  gap: '1.25rem',
                  marginBottom: '2.5rem'
                }}
              >
                <div className="card">
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-slate)' }}>TOTAL REPORTS</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-navy)', marginTop: '0.35rem' }}>
                    {metrics.total}
                  </div>
                </div>
                <div className="card">
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-slate)' }}>PENDING INCOMING</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1F5472', marginTop: '0.35rem' }}>
                    {metrics.submitted}
                  </div>
                </div>
                <div className="card">
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-slate)' }}>UNDER REVIEW</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-teal)', marginTop: '0.35rem' }}>
                    {metrics.inReview}
                  </div>
                </div>
                <div className="card">
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-slate)' }}>ACTION REQUIRED</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-amber)', marginTop: '0.35rem' }}>
                    {metrics.actionRequired}
                  </div>
                </div>
                <div className="card">
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-slate)' }}>RESOLVED</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-navy)', marginTop: '0.35rem' }}>
                    {metrics.resolved}
                  </div>
                </div>
              </div>
            )}

            {/* Category Distribution */}
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Category Distribution</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                {categoryStats.map((item) => (
                  <div
                    key={item.category}
                    style={{
                      padding: '0.875rem',
                      backgroundColor: 'var(--color-ivory)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.category}</span>
                    <span
                      style={{
                        backgroundColor: 'var(--color-mint)',
                        color: 'var(--color-teal)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 700,
                        fontSize: '0.8125rem'
                      }}
                    >
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <button onClick={() => setActiveTab('incoming')} className="btn btn-primary">
                View Incoming Report Queue
              </button>
            </div>
          </div>
        )}

        {/* QUEUE TABS: incoming / in_review / resolved */}
        {activeTab !== 'overview' && activeTab !== 'settings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', textTransform: 'capitalize' }}>
                  {activeTab.replace('_', ' ')} Reports
                </h1>
                <p style={{ color: 'var(--color-slate)', fontSize: '0.875rem' }}>
                  Evaluate complaints and provide official responses with zero submitter identity exposure.
                </p>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ width: '220px', padding: '0.45rem 0.75rem', fontSize: '0.875rem' }}
                  placeholder="Search reference, keywords..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="btn btn-secondary btn-sm">
                  <Search size={15} /> Search
                </button>
              </form>
            </div>

            {/* Table */}
            {loading ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <p>Loading reports...</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: 'var(--color-slate)' }}>No reports match the current filter or queue.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Category</th>
                      <th>Submitted On</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Department/Loc</th>
                      <th style={{ textAlign: 'right' }}>Review Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report.reference}>
                        <td style={{ fontWeight: 700, color: 'var(--color-navy)' }}>
                          {report.reference}
                        </td>
                        <td>{report.category}</td>
                        <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: report.priority === 'Urgent' ? 'var(--color-red)' : 'var(--color-slate)'
                            }}
                          >
                            {report.priority}
                          </span>
                        </td>
                        <td>
                          <StatusBadge status={report.status} />
                        </td>
                        <td style={{ fontSize: '0.8125rem', color: 'var(--color-slate)' }}>
                          {report.departmentOrLocation || '—'}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => handleOpenDetail(report)}
                            className="btn btn-primary btn-sm"
                          >
                            Examine & Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS / GUIDELINES TAB */}
        {activeTab === 'settings' && (
          <div className="card" style={{ maxWidth: '800px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Reviewer Responsibilities & Code of Conduct</h2>
            <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
              <ShieldAlert size={20} style={{ flexShrink: 0 }} />
              <div>
                <strong>Duty of Non-Correlation:</strong> Reviewers must not attempt to correlate incident timing, location markers, or narrative nuances with specific individuals. All reports must be judged solely on objective merits.
              </div>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
              <li>
                <strong>1. Objective Evaluation:</strong> Address systemic or procedural faults rather than attempting to ascertain submitter motives.
              </li>
              <li>
                <strong>2. Constructive Official Responses:</strong> Use the official response tool to communicate concrete actions taken, committee review schedules, or policy clarifications.
              </li>
              <li>
                <strong>3. Confidential Handling:</strong> Never quote unique narrative phrases from complaints in open public notices.
              </li>
            </ul>
          </div>
        )}

        {/* REPORT DETAIL & ACTION MODAL */}
        {selectedReport && (
          <Modal
            isOpen={!!selectedReport}
            onClose={() => setSelectedReport(null)}
            title={`Reviewing Report: ${selectedReport.reference}`}
            maxWidth="750px"
          >
            {/* Header badges */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <StatusBadge status={selectedReport.status} />
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-slate)' }}>
                  Category: <strong>{selectedReport.category}</strong>
                </span>
              </div>
              <button
                onClick={() => setIsUpdateModalOpen(true)}
                className="btn btn-secondary btn-sm"
              >
                Change Status
              </button>
            </div>

            {/* Zero identity notice */}
            <div
              style={{
                backgroundColor: 'var(--color-mint)',
                border: '1px solid #BFE2D5',
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                color: 'var(--color-navy)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem'
              }}
            >
              <EyeOff size={15} color="var(--color-teal)" />
              <span>Submitter Account Email & Identity: <strong>[STRIPPED BY UNSEEN PRIVACY BOUNDARY]</strong></span>
            </div>

            {/* Narrative Box */}
            <div
              style={{
                backgroundColor: 'var(--color-ivory)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                marginBottom: '1.25rem'
              }}
            >
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Narrative Problem Description
              </h4>
              <p style={{ fontSize: '0.9375rem', whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--color-navy)' }}>
                {selectedReport.description}
              </p>
            </div>

            {/* Context Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.8125rem' }}>
              <div>
                <strong>Location/Dept:</strong> {selectedReport.departmentOrLocation || 'Not provided'}
              </div>
              <div>
                <strong>Incident Period:</strong> {selectedReport.incidentDate || 'Not provided'}
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong>Requested Resolution:</strong> {selectedReport.requestedResolution || 'Not provided'}
              </div>
            </div>

            {/* Official Reviewer Responses */}
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Official Responses Attached to Case
            </h4>
            {(!selectedReport.reviewerResponses || selectedReport.reviewerResponses.length === 0) ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-slate)', marginBottom: '1.25rem' }}>
                No responses recorded yet. Use the composer below to issue a response.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {selectedReport.reviewerResponses.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: 'var(--color-teal-light)',
                      border: '1px solid #C4E5DC',
                      padding: '0.875rem',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                      <strong style={{ color: 'var(--color-teal)' }}>{r.roleLabel}</strong>
                      <span style={{ color: 'var(--color-slate)' }}>{new Date(r.timestamp).toLocaleString()}</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-navy)' }}>{r.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Compose Response */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--color-border)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Add Official Response (Visible to Submitter Privately)
              </h4>
              <form onSubmit={handlePostResponse}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Your Role Title (e.g. Academic Ombudsperson, Welfare Committee)"
                    value={roleLabel}
                    onChange={(e) => setRoleLabel(e.target.value)}
                    style={{ marginBottom: '0.5rem', fontSize: '0.8125rem' }}
                  />
                  <textarea
                    className="form-textarea"
                    style={{ minHeight: '80px', fontSize: '0.875rem' }}
                    placeholder="Type official response or resolution update..."
                    value={responseMsg}
                    onChange={(e) => setResponseMsg(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    disabled={submittingResponse || !responseMsg.trim()}
                    className="btn btn-primary btn-sm"
                  >
                    <Send size={14} /> {submittingResponse ? 'Posting...' : 'Post Official Response'}
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        )}

        {/* STATUS UPDATE MODAL */}
        {isUpdateModalOpen && selectedReport && (
          <Modal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            title={`Update Status: ${selectedReport.reference}`}
            maxWidth="500px"
          >
            <form onSubmit={handleUpdateStatus}>
              <div className="form-group">
                <label className="form-label" htmlFor="statusSelect">
                  New Status
                </label>
                <select
                  id="statusSelect"
                  className="form-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Under review">Under review</option>
                  <option value="Action required">Action required</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="statusNote">
                  Status Transition Note (Optional)
                </label>
                <textarea
                  id="statusNote"
                  className="form-textarea"
                  style={{ minHeight: '80px' }}
                  placeholder="e.g. Case assigned to grievance panel; rubric review underway..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  maxLength={500}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingStatus}
                  className="btn btn-primary"
                >
                  {updatingStatus ? 'Updating...' : 'Save Status Update'}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </main>
    </div>
  );
}
