import React, { useState } from 'react';
import { api } from '../services/api.js';
import { useNotification } from '../context/NotificationContext.jsx';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  AlertTriangle,
  Info,
  HelpCircle,
  Layers,
  Sparkles
} from 'lucide-react';

export function SelectiveDisclosureDemoPage() {
  const { showSuccess, showError } = useNotification();

  const [attributeType, setAttributeType] = useState('student_status');
  const [testValue, setTestValue] = useState('STU-8829');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleTestProof = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.demo.testSelectiveDisclosure(attributeType, testValue);
      if (res.success) {
        setResult(res.verificationResult);
        showSuccess('Simulated attribute proof evaluated.');
      }
    } catch (err) {
      showError(err.message || 'Proof simulation failed.');
    } finally {
      setLoading(false);
    }
  };

  const setPreset = (type, val) => {
    setAttributeType(type);
    setTestValue(val);
    setResult(null);
  };

  return (
    <div className="section-sm">
      <div className="container" style={{ maxWidth: '820px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-teal)',
              backgroundColor: 'var(--color-mint)',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            Privacy Engineering Concept
          </span>
          <h1 style={{ fontSize: '1.875rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
            Selective Disclosure Demonstration
          </h1>
          <p style={{ color: 'var(--color-slate)', fontSize: '0.9375rem', maxWidth: '640px', margin: '0 auto' }}>
            Explore how modern cryptography allows an individual to prove an eligibility attribute (e.g., active student status, adult age) without disclosing their legal name or government ID numbers.
          </p>
        </div>

        {/* Clear Educational Simulation Notice */}
        <div
          className="alert alert-info"
          style={{
            marginBottom: '2rem',
            padding: '1.25rem'
          }}
        >
          <Info size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ fontSize: '0.9375rem' }}>Simulated Demonstration Notice</strong>
            <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem', lineHeight: 1.5 }}>
              This is an educational synthetic simulation demonstrating selective disclosure and zero-knowledge concepts. UNSEEN does not connect to government identity registries or live university SIS databases. <strong>No real Aadhaar numbers, OTPs, or passwords are ever accepted.</strong>
            </p>
          </div>
        </div>

        {/* Preset Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.875rem', marginBottom: '2rem' }}>
          <button
            type="button"
            onClick={() => setPreset('student_status', 'STU-8829')}
            className={`card ${attributeType === 'student_status' ? 'selected-preset' : ''}`}
            style={{
              textAlign: 'left',
              cursor: 'pointer',
              border: attributeType === 'student_status' ? '2px solid var(--color-teal)' : '1px solid var(--color-border)',
              backgroundColor: attributeType === 'student_status' ? 'var(--color-teal-light)' : '#FFFFFF',
              padding: '1rem'
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-navy)', marginBottom: '0.25rem' }}>
              1. Enrolled Student
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>
              Proves active university enrollment without sharing student name or GPA.
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPreset('age_threshold', '2002')}
            className={`card ${attributeType === 'age_threshold' ? 'selected-preset' : ''}`}
            style={{
              textAlign: 'left',
              cursor: 'pointer',
              border: attributeType === 'age_threshold' ? '2px solid var(--color-teal)' : '1px solid var(--color-border)',
              backgroundColor: attributeType === 'age_threshold' ? 'var(--color-teal-light)' : '#FFFFFF',
              padding: '1rem'
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-navy)', marginBottom: '0.25rem' }}>
              2. Age Threshold (18+)
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>
              Proves age &ge; 18 without revealing exact Date of Birth or birth location.
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPreset('department_membership', 'Engineering')}
            className={`card ${attributeType === 'department_membership' ? 'selected-preset' : ''}`}
            style={{
              textAlign: 'left',
              cursor: 'pointer',
              border: attributeType === 'department_membership' ? '2px solid var(--color-teal)' : '1px solid var(--color-border)',
              backgroundColor: attributeType === 'department_membership' ? 'var(--color-teal-light)' : '#FFFFFF',
              padding: '1rem'
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-navy)', marginBottom: '0.25rem' }}>
              3. Faculty Affiliation
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>
              Proves affiliation with target faculty without exposing payroll ID or supervisor.
            </div>
          </button>
        </div>

        {/* Interactive Simulator Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1875rem', marginBottom: '1.25rem' }}>
            Simulate Proof Generation
          </h3>

          <form onSubmit={handleTestProof}>
            <div className="form-group">
              <label className="form-label">Selected Attribute Verification Type</label>
              <select
                className="form-select"
                value={attributeType}
                onChange={(e) => {
                  setAttributeType(e.target.value);
                  setResult(null);
                }}
              >
                <option value="student_status">Active Student Status Proof</option>
                <option value="age_threshold">Age Threshold (&ge; 18) Range Proof</option>
                <option value="department_membership">Department Group Membership Proof</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Synthetic Input Value (Simulating cryptographic credential assertion)
              </label>
              <input
                type="text"
                className="form-input"
                value={testValue}
                onChange={(e) => setTestValue(e.target.value)}
                placeholder="Enter synthetic sample value..."
                required
              />
              <div className="form-helper">
                {attributeType === 'student_status' && 'Try STU-8829 (Valid) or invalid_id (Fails)'}
                {attributeType === 'age_threshold' && 'Enter synthetic Birth Year (e.g. 2002 for 24 yrs, 2015 for 11 yrs)'}
                {attributeType === 'department_membership' && 'Try Engineering, Sciences, or Unaffiliated'}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading ? 'Evaluating Zero-Knowledge Proof...' : 'Simulate Selective Disclosure'}
            </button>
          </form>
        </div>

        {/* Simulation Output Results */}
        {result && (
          <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--color-teal)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {result.proofSatisfied ? (
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-mint)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CheckCircle2 size={22} color="var(--color-teal)" />
                </div>
              ) : (
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-red-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <XCircle size={22} color="var(--color-red)" />
                </div>
              )}
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-slate)' }}>
                  Verification Outcome
                </span>
                <h3 style={{ fontSize: '1.25rem' }}>
                  {result.proofSatisfied ? 'Attribute Condition Satisfied' : 'Proof Evaluation Failed'}
                </h3>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              {/* Proved Claims */}
              <div
                style={{
                  backgroundColor: 'var(--color-teal-light)',
                  border: '1px solid #C4E5DC',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--color-teal)', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                  <Eye size={16} /> Disclosed To Reviewer (Minimal Claim Only)
                </div>
                <ul style={{ listStyle: 'none', fontSize: '0.8125rem', color: 'var(--color-navy)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {Object.entries(result.verifiedClaims || {}).map(([k, v]) => (
                    <li key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <CheckCircle2 size={14} color="var(--color-teal)" />
                      <strong>{k}:</strong> {String(v)}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Concealed Attributes */}
              <div
                style={{
                  backgroundColor: '#FAFBFB',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--color-slate)', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                  <EyeOff size={16} /> Concealed Personal Identifiers (Never Shared)
                </div>
                <ul style={{ listStyle: 'none', fontSize: '0.8125rem', color: 'var(--color-slate)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {result.concealedAttributes?.map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ color: 'var(--color-red)', fontWeight: 700 }}>✕</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ fontSize: '0.8125rem', color: 'var(--color-slate)', lineHeight: 1.5 }}>
              <strong>Proof Type:</strong> {result.proofType} — Proves truth value without supplying underlying identification credentials to the receiver.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
