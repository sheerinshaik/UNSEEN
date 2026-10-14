import React, { useState } from 'react';
import { api } from '../services/api.js';
import { useNotification } from '../context/NotificationContext.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import {
  Search,
  Lock,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  MessageSquare,
  FileText,
  AlertCircle
} from 'lucide-react';

export function TrackReportPage() {
  const { showSuccess, showError } = useNotification();
  const [reference, setReference] = useState('');
  const [trackingSecret, setTrackingSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!reference.trim() || !trackingSecret.trim()) {
      showError('Both report reference and tracking secret are required.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.reports.track({
        reference: reference.trim().toUpperCase(),
        trackingSecret: trackingSecret.trim()
      });

      if (res.success && res.report) {
        setReport(res.report);
        showSuccess('Report found. Access granted via tracking secret.');
      }
    } catch (err) {
      setReport(null);
      showError(err.message || 'Access denied. Please check your reference and tracking secret.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setReport(null);
    setReference('');
    setTrackingSecret('');
  };

  return (
    <div className="section-sm">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Private Report Tracking</h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-slate)' }}>
            Enter your reference and private secret to inspect status updates and official reviewer responses.
          </p>
        </div>

        {/* Lookup Card */}
        {!report && (
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <form onSubmit={handleTrack}>
              <div className="form-group">
                <label className="form-label" htmlFor="refInput">
                  Report Reference
                </label>
                <input
                  id="refInput"
                  type="text"
                  className="form-input"
                  placeholder="e.g. UNS-A1B2-C3D4-E5F6"
                  value={reference}
                  onChange={(e) => setReference(e.target.value.toUpperCase())}
                  required
                />
                <div className="form-helper">Format: UNS-XXXX-XXXX-XXXX</div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="secretInput">
                  Private Tracking Secret
                </label>
                <input
                  id="secretInput"
                  type="password"
                  className="form-input"
                  placeholder="e.g. sec_..."
                  value={trackingSecret}
                  onChange={(e) => setTrackingSecret(e.target.value)}
                  required
                />
                <div className="form-helper">
                  Required high-entropy secret issued during submission.
                </div>
              </div>

              <div className="alert alert-info" style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
                <Lock size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.8125rem' }}>
                  <strong>Security notice:</strong> A report reference alone cannot authorize private report retrieval. Both values must validate against the server's salted hash.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                {loading ? 'Authenticating Secret...' : 'Access Report Details'}
              </button>
            </form>
          </div>
        )}

        {/* Report Details Display */}
        {report && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                  {report.reference}
                </span>
                <StatusBadge status={report.status} />
              </div>
              <button onClick={handleClear} className="btn btn-secondary btn-sm">
                Check Another Report
              </button>
            </div>

            {/* Case Details Card */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid var(--color-border)',
                  marginBottom: '1.25rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)', fontWeight: 600 }}>CATEGORY</div>
                  <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{report.category}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)', fontWeight: 600 }}>SUBMITTED ON</div>
                  <div style={{ color: 'var(--color-navy)' }}>
                    {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                </div>
                {report.departmentOrLocation && (
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)', fontWeight: 600 }}>DEPARTMENT/LOCATION</div>
                    <div style={{ color: 'var(--color-navy)' }}>{report.departmentOrLocation}</div>
                  </div>
                )}
                {report.incidentDate && (
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)', fontWeight: 600 }}>INCIDENT PERIOD</div>
                    <div style={{ color: 'var(--color-navy)' }}>{report.incidentDate}</div>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                  Submitted Problem Narrative
                </h4>
                <p style={{ fontSize: '0.9375rem', color: 'var(--color-navy)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {report.description}
                </p>
              </div>

              {report.requestedResolution && (
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                    Requested Resolution
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-slate)' }}>
                    {report.requestedResolution}
                  </p>
                </div>
              )}
            </div>

            {/* Official Reviewer Responses */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <MessageSquare size={18} color="var(--color-teal)" />
                <h3 style={{ fontSize: '1.125rem' }}>Official Reviewer Responses</h3>
              </div>

              {(!report.reviewerResponses || report.reviewerResponses.length === 0) ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-slate)', backgroundColor: 'var(--color-ivory)', borderRadius: 'var(--radius-sm)' }}>
                  No responses have been posted yet. Authorized reviewers evaluate submissions in queue order.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {report.reviewerResponses.map((resp, i) => (
                    <div
                      key={resp._id || i}
                      style={{
                        backgroundColor: 'var(--color-teal-light)',
                        border: '1px solid #C5E5DC',
                        borderRadius: 'var(--radius-sm)',
                        padding: '1.25rem'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.5rem',
                          fontSize: '0.8125rem'
                        }}
                      >
                        <span style={{ fontWeight: 700, color: 'var(--color-teal)' }}>
                          {resp.roleLabel || 'Authorized Reviewer'}
                        </span>
                        <span style={{ color: 'var(--color-slate)' }}>
                          {new Date(resp.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.9375rem', color: 'var(--color-navy)', lineHeight: 1.6 }}>
                        {resp.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chronological Timeline */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Clock size={18} color="var(--color-teal)" />
                <h3 style={{ fontSize: '1.125rem' }}>Workflow History & Milestones</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '2px solid var(--color-mint)', paddingLeft: '1rem', marginLeft: '0.5rem' }}>
                {report.timeline?.map((item, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: '-1.375rem',
                        top: '4px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-teal)'
                      }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-navy)' }}>
                        {item.status}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {item.note && (
                      <p style={{ fontSize: '0.8125rem', color: 'var(--color-slate)' }}>{item.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
