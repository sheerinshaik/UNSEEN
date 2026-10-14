import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import {
  ShieldAlert,
  ShieldCheck,
  Check,
  Copy,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Info
} from 'lucide-react';

export function SubmitReportPage() {
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  // Wizard state: 1: Category, 2: Describe, 3: Privacy Review, 4: Confirmation
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [departmentOrLocation, setDepartmentOrLocation] = useState('');
  const [requestedResolution, setRequestedResolution] = useState('');

  // Result from Step 4 Confirmation
  const [submissionResult, setSubmissionResult] = useState(null);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Load categories and guidelines from server
  useEffect(() => {
    async function loadConfig() {
      try {
        setLoading(true);
        const res = await api.reports.getCategories();
        if (res.categories) {
          setCategories(res.categories);
          if (!category && res.categories.length > 0) {
            setCategory(res.categories[0]);
          }
        }
      } catch (err) {
        showError('Unable to load categories from server.');
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const handleNextToDescription = (e) => {
    e.preventDefault();
    if (!category) {
      showError('Please select a category for your concern.');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextToReview = (e) => {
    e.preventDefault();
    if (description.trim().length < 20) {
      showError('Please provide at least 20 characters describing the issue.');
      return;
    }
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = async () => {
    try {
      setSubmitting(true);
      const payload = {
        category,
        description: description.trim(),
        incidentDate: incidentDate.trim(),
        departmentOrLocation: departmentOrLocation.trim(),
        requestedResolution: requestedResolution.trim()
      };

      const res = await api.reports.submit(payload);
      if (res.success && res.report) {
        setSubmissionResult(res.report);
        setStep(4);
        showSuccess('Report securely submitted!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      showError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedSecret(true);
    showSuccess('Tracking secret copied to clipboard!');
    setTimeout(() => setCopiedSecret(false), 3000);
  };

  return (
    <div className="section-sm">
      <div className="container" style={{ maxWidth: '780px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Confidential Report Submission</h1>
          <p style={{ fontSize: '0.9375rem' }}>
            Submit an issue with zero reviewer-visible identity disclosure.
          </p>
        </div>

        {/* Stepper Indicator */}
        <div className="stepper">
          <div className={`step-item ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-circle">{step > 1 ? <Check size={16} /> : '1'}</div>
            <div className="step-label">Category</div>
          </div>
          <div className={`step-item ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-circle">{step > 2 ? <Check size={16} /> : '2'}</div>
            <div className="step-label">Describe</div>
          </div>
          <div className={`step-item ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
            <div className="step-circle">{step > 3 ? <Check size={16} /> : '3'}</div>
            <div className="step-label">Privacy Review</div>
          </div>
          <div className={`step-item ${step === 4 ? 'active completed' : ''}`}>
            <div className="step-circle">4</div>
            <div className="step-label">Confirmation</div>
          </div>
        </div>

        {/* STEP 1: CHOOSE CATEGORY */}
        {step === 1 && (
          <div className="card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Step 1 — Choose a category</h2>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Select the option that most accurately reflects your problem. Categories assist in routing reports to the proper review authority.
            </p>

            <form onSubmit={handleNextToDescription}>
              <div style={{ display: 'grid', gap: '0.875rem', marginBottom: '2rem' }}>
                {categories.map((cat) => (
                  <label
                    key={cat}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.875rem',
                      padding: '1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: `1.5px solid ${category === cat ? 'var(--color-teal)' : 'var(--color-border)'}`,
                      backgroundColor: category === cat ? 'var(--color-teal-light)' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={category === cat}
                      onChange={(e) => setCategory(e.target.value)}
                      style={{ accentColor: 'var(--color-teal)', width: '18px', height: '18px' }}
                    />
                    <span style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '0.9375rem' }}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary btn-lg">
                  Continue to Description <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: DESCRIBE THE PROBLEM */}
        {step === 2 && (
          <div className="card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Step 2 — Describe the problem</h2>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Explain what occurred in your own words. Reviewers will read this narrative to understand and address the concern.
            </p>

            {/* Prompt Banner */}
            <div
              style={{
                backgroundColor: 'var(--color-teal-light)',
                border: '1px solid #BEE2D7',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--color-teal)', fontSize: '0.9375rem', marginBottom: '0.25rem' }}>
                Prompt:
              </div>
              <div style={{ color: 'var(--color-navy)', fontSize: '0.9375rem', fontStyle: 'italic' }}>
                "Tell us what happened, why it is a problem, and what outcome would help."
              </div>
            </div>

            <form onSubmit={handleNextToReview}>
              <div className="form-group">
                <label className="form-label" htmlFor="description">
                  Problem Description *
                </label>
                <textarea
                  id="description"
                  className="form-textarea"
                  style={{ minHeight: '160px' }}
                  placeholder="Explain the incident, unfair practice, delay, or uncomfortable situation..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={5000}
                  required
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: 'var(--color-slate)',
                    marginTop: '0.375rem'
                  }}
                >
                  <span>Minimum 20 characters. Avoid personal names or contact info.</span>
                  <span>{description.length} / 5000</span>
                </div>
              </div>

              {/* Context Warning */}
              <div className="alert alert-warning" style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Privacy Warning:</strong> The text of your report will be read by reviewers. Avoid including personal names, phone numbers, unique student IDs, or specific room details that could unintentionally reveal your identity.
                </div>
              </div>

              <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.75rem' }}>
                Optional Context (Helps route your report)
              </h4>

              <div className="form-group">
                <label className="form-label" htmlFor="incidentDate">
                  Approximate date or period (optional)
                </label>
                <input
                  id="incidentDate"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Early October 2026, or Past 3 weeks"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  maxLength={100}
                />
                <div className="form-helper">Provides context without revealing exact timestamps.</div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="department">
                  General department or location (optional)
                </label>
                <input
                  id="department"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Engineering Department, Registrar Counter, Municipal Ward 4"
                  value={departmentOrLocation}
                  onChange={(e) => setDepartmentOrLocation(e.target.value)}
                  maxLength={150}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="requestedResolution">
                  Requested resolution (optional)
                </label>
                <textarea
                  id="requestedResolution"
                  className="form-textarea"
                  style={{ minHeight: '80px' }}
                  placeholder="What outcome would help resolve this concern? e.g. An independent review of grading rubrics, audit of delayed file queue..."
                  value={requestedResolution}
                  onChange={(e) => setRequestedResolution(e.target.value)}
                  maxLength={1000}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button type="button" onClick={() => setStep(1)} className="btn btn-secondary">
                  <ArrowLeft size={16} /> Back
                </button>
                <button type="submit" className="btn btn-primary btn-lg">
                  Review Privacy Settings <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: PRIVACY REVIEW */}
        {step === 3 && (
          <div className="card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Step 3 — Privacy Review</h2>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Inspect the exact information that will be shared before transmitting this report.
            </p>

            {/* Information-sharing summary table */}
            <div className="table-container" style={{ marginBottom: '1.75rem' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '40%' }}>Information Category</th>
                    <th style={{ width: '30%' }}>Included in Report?</th>
                    <th style={{ width: '30%' }}>Visible to Reviewers?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Report Narrative & Category</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>Your description, category, and requested outcome</div>
                    </td>
                    <td><span style={{ color: 'var(--color-teal)', fontWeight: 600 }}>YES</span></td>
                    <td><span style={{ color: 'var(--color-teal)', fontWeight: 600 }}>YES</span></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Report Reference</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>Random cryptographic reference code</div>
                    </td>
                    <td><span style={{ color: 'var(--color-teal)', fontWeight: 600 }}>YES (Random)</span></td>
                    <td><span style={{ color: 'var(--color-teal)', fontWeight: 600 }}>YES</span></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Your Account Email / Name</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>
                        {isAuthenticated ? `Logged in as ${user?.email}` : 'Submitting anonymously'}
                      </div>
                    </td>
                    <td><span style={{ color: 'var(--color-slate)', fontWeight: 600 }}>NO (Excluded)</span></td>
                    <td><span style={{ color: 'var(--color-red)', fontWeight: 700 }}>NEVER SHOWN</span></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Account ID & Password Hash</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>System identifiers and cryptographic hashes</div>
                    </td>
                    <td><span style={{ color: 'var(--color-slate)', fontWeight: 600 }}>NO (Excluded)</span></td>
                    <td><span style={{ color: 'var(--color-red)', fontWeight: 700 }}>NEVER SHOWN</span></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>IP Address / Network Location</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>Network connection metadata</div>
                    </td>
                    <td><span style={{ color: 'var(--color-slate)', fontWeight: 600 }}>NO</span></td>
                    <td><span style={{ color: 'var(--color-red)', fontWeight: 700 }}>NEVER SHOWN</span></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Private Tracking Secret</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>One-time token generated for you</div>
                    </td>
                    <td><span style={{ color: 'var(--color-amber)', fontWeight: 600 }}>Stored only as hash</span></td>
                    <td><span style={{ color: 'var(--color-red)', fontWeight: 700 }}>NEVER SHOWN</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary Draft Preview */}
            <div
              style={{
                backgroundColor: 'var(--color-ivory)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.25rem',
                marginBottom: '1.75rem'
              }}
            >
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                Review Your Submission Draft:
              </h4>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-slate)', marginBottom: '0.35rem' }}>
                <strong>Category:</strong> {category}
              </div>
              {departmentOrLocation && (
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-slate)', marginBottom: '0.35rem' }}>
                  <strong>Department / Location:</strong> {departmentOrLocation}
                </div>
              )}
              {incidentDate && (
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-slate)', marginBottom: '0.35rem' }}>
                  <strong>Incident Period:</strong> {incidentDate}
                </div>
              )}
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-navy)', marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>
                <strong>Description:</strong> {description}
              </div>
            </div>

            <div className="alert alert-info" style={{ marginBottom: '2rem' }}>
              <Info size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong>Identity Disclosure Requirement:</strong> The selected workflow does not require personal identification. Submitting will create a confidential case file with no reviewer-accessible account link.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={submitting}
                className="btn btn-secondary"
              >
                <ArrowLeft size={16} /> Edit Report
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="btn btn-primary btn-lg"
              >
                {submitting ? 'Encrypting & Submitting...' : 'Confirm & Submit Report'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CONFIRMATION & ONE-TIME SECRET */}
        {step === 4 && submissionResult && (
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-mint)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}
            >
              <ShieldCheck size={36} color="var(--color-teal)" />
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Report Submitted Confidentially</h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--color-slate)', marginBottom: '2rem' }}>
              Your concern has been registered under a non-sequential reference. No personal account details were transferred to the reviewer queue.
            </p>

            {/* Reference Box */}
            <div
              style={{
                backgroundColor: 'var(--color-ivory)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-slate)' }}>
                    PUBLIC REPORT REFERENCE
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)', letterSpacing: '0.05em' }}>
                    {submissionResult.reference}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-slate)' }}>STATUS</div>
                  <span className="badge badge-submitted">{submissionResult.status}</span>
                </div>
              </div>

              {/* Secret Warning Banner */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px dashed var(--color-teal)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem',
                  marginTop: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Lock size={16} color="var(--color-teal)" />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-navy)' }}>
                    ONE-TIME PRIVATE TRACKING SECRET (SAVE THIS NOW)
                  </span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-slate)', marginBottom: '0.75rem' }}>
                  This secret is required to view updates anonymously. The server stores only a cryptographic hash; this plaintext value will never be shown again and cannot be reset.
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'var(--color-ivory)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <code style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-teal)', flex: 1, wordBreak: 'break-all' }}>
                    {submissionResult.trackingSecret}
                  </code>
                  <button
                    onClick={() => copyToClipboard(submissionResult.trackingSecret)}
                    className="btn btn-secondary btn-sm"
                    style={{ flexShrink: 0 }}
                  >
                    {copiedSecret ? <Check size={14} /> : <Copy size={14} />} {copiedSecret ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/track" className="btn btn-secondary btn-lg">
                Go to Tracking Page
              </Link>
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  View in My Reports Dashboard
                </Link>
              ) : (
                <Link to="/register" className="btn btn-primary btn-lg">
                  Create Account to Manage Reports
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
