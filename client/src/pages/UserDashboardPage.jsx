import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { Modal } from '../components/Modal.jsx';
import {
  PlusCircle,
  Clock,
  Shield,
  FileText,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  Lock
} from 'lucide-react';

export function UserDashboardPage() {
  const { user } = useAuth();
  const { showError } = useNotification();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        const res = await api.reports.getMyReports();
        if (res.reports) {
          setReports(res.reports);
        }
      } catch (err) {
        showError('Unable to load private reports list.');
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  return (
    <div className="section-sm">
      <div className="container">
        {/* Welcome & Action Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem'
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-teal)'
              }}
            >
              Citizen Private Vault
            </span>
            <h1 style={{ fontSize: '1.75rem', marginTop: '0.25rem' }}>Your Confidential Reports</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-slate)' }}>
              Authenticated session: {user?.email} (Identity is isolated from reviewer queue)
            </p>
          </div>

          <Link to="/submit" className="btn btn-primary btn-lg">
            <PlusCircle size={18} /> Submit a concern
          </Link>
        </div>

        {/* Metrics Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}
        >
          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)', fontWeight: 600 }}>TOTAL SUBMITTED</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-navy)', marginTop: '0.25rem' }}>
              {reports.length}
            </div>
          </div>
          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)', fontWeight: 600 }}>IN REVIEW</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-teal)', marginTop: '0.25rem' }}>
              {reports.filter((r) => r.status === 'Under review').length}
            </div>
          </div>
          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)', fontWeight: 600 }}>ACTION REQUIRED</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-amber)', marginTop: '0.25rem' }}>
              {reports.filter((r) => r.status === 'Action required').length}
            </div>
          </div>
          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)', fontWeight: 600 }}>RESOLVED</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-navy)', marginTop: '0.25rem' }}>
              {reports.filter((r) => r.status === 'Resolved').length}
            </div>
          </div>
        </div>

        {/* Reports Listing */}
        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Loading your private report vault...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-mint)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <Shield size={28} color="var(--color-teal)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Reports Submitted Yet</h3>
            <p style={{ maxWidth: '520px', margin: '0 auto 1.75rem', color: 'var(--color-slate)', fontSize: '0.9375rem' }}>
              You haven't submitted a concern yet. When you're ready, you can start a report and review its privacy settings before submitting.
            </p>
            <Link to="/submit" className="btn btn-primary">
              <PlusCircle size={16} /> Submit your first report
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Report Reference</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th>Responses</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.reference}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--color-navy)' }}>
                        {report.reference}
                      </span>
                    </td>
                    <td>{report.category}</td>
                    <td>
                      <StatusBadge status={report.status} />
                    </td>
                    <td>{new Date(report.updatedAt || report.createdAt).toLocaleDateString()}</td>
                    <td>
                      {report.reviewerResponses && report.reviewerResponses.length > 0 ? (
                        <span style={{ color: 'var(--color-teal)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MessageSquare size={14} /> {report.reviewerResponses.length}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-slate)' }}>None</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="btn btn-secondary btn-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Report Detail Modal */}
        {selectedReport && (
          <Modal
            isOpen={!!selectedReport}
            onClose={() => setSelectedReport(null)}
            title={`Report: ${selectedReport.reference}`}
            maxWidth="700px"
          >
            <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <StatusBadge status={selectedReport.status} />
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-slate)' }}>
                Category: <strong>{selectedReport.category}</strong>
              </span>
            </div>

            <div
              style={{
                backgroundColor: 'var(--color-ivory)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.25rem'
              }}
            >
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                Narrative Problem Description
              </h4>
              <p style={{ fontSize: '0.9375rem', whiteSpace: 'pre-wrap', color: 'var(--color-navy)', lineHeight: 1.6 }}>
                {selectedReport.description}
              </p>
            </div>

            {selectedReport.departmentOrLocation && (
              <div style={{ fontSize: '0.8125rem', marginBottom: '0.5rem' }}>
                <strong>Department/Location:</strong> {selectedReport.departmentOrLocation}
              </div>
            )}
            {selectedReport.incidentDate && (
              <div style={{ fontSize: '0.8125rem', marginBottom: '0.5rem' }}>
                <strong>Incident Period:</strong> {selectedReport.incidentDate}
              </div>
            )}
            {selectedReport.requestedResolution && (
              <div style={{ fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
                <strong>Requested Resolution:</strong> {selectedReport.requestedResolution}
              </div>
            )}

            {/* Reviewer Responses */}
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginTop: '1.25rem', marginBottom: '0.75rem' }}>
              Official Reviewer Responses
            </h4>
            {(!selectedReport.reviewerResponses || selectedReport.reviewerResponses.length === 0) ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-slate)' }}>
                No reviewer response posted yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
                      <strong style={{ color: 'var(--color-teal)' }}>{r.roleLabel || 'Reviewer'}</strong>
                      <span style={{ color: 'var(--color-slate)' }}>{new Date(r.timestamp).toLocaleString()}</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-navy)' }}>{r.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Timeline */}
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Status Timeline
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '2px solid var(--color-mint)', paddingLeft: '0.75rem' }}>
              {selectedReport.timeline?.map((t, idx) => (
                <div key={idx} style={{ fontSize: '0.8125rem' }}>
                  <span style={{ fontWeight: 600 }}>{t.status}</span> —{' '}
                  <span style={{ color: 'var(--color-slate)' }}>{new Date(t.timestamp).toLocaleDateString()}</span>
                  {t.note && <div style={{ color: 'var(--color-slate)', marginTop: '2px' }}>{t.note}</div>}
                </div>
              ))}
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
