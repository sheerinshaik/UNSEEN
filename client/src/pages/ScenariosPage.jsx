import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  FileText,
  UserCheck,
  CheckCircle2
} from 'lucide-react';

export function ScenariosPage() {
  const [scenarios, setScenarios] = useState([]);
  const [disclaimer, setDisclaimer] = useState('');
  const [selectedScenario, setSelectedScenario] = useState('student-treatment');

  useEffect(() => {
    async function loadScenarios() {
      try {
        const res = await api.demo.getScenarios();
        if (res.scenarios) {
          setScenarios(res.scenarios);
          setDisclaimer(res.disclaimer);
        }
      } catch (err) {
        console.error('Failed to load scenarios:', err);
      }
    }
    loadScenarios();
  }, []);

  const current = scenarios.find((s) => s.id === selectedScenario) || scenarios[0];

  return (
    <div className="section-sm">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-teal)'
            }}
          >
            Realistic Prototype Walkthroughs
          </span>
          <h1 style={{ fontSize: '1.875rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
            Demonstration Scenarios
          </h1>
          <p style={{ color: 'var(--color-slate)', fontSize: '0.9375rem', maxWidth: '640px', margin: '0 auto' }}>
            Explore how UNSEEN structures confidential reporting in education and civic administration using synthetic demonstration data.
          </p>
        </div>

        {/* Mandatory Statutory Notice */}
        <div
          className="alert alert-warning"
          style={{
            marginBottom: '2rem',
            padding: '1.25rem'
          }}
        >
          <AlertCircle size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ fontSize: '0.9375rem' }}>Demonstration Notice & Statutory Disclaimer</strong>
            <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem', lineHeight: 1.5 }}>
              {disclaimer ||
                'UNSEEN is an independent demonstration platform and is not connected to government grievance systems or official identity databases. Submitting a report here does not file an official complaint.'}
            </p>
          </div>
        </div>

        {/* Scenario Selection Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setSelectedScenario('student-treatment')}
            className={`card ${selectedScenario === 'student-treatment' ? 'active-scenario' : ''}`}
            style={{
              textAlign: 'left',
              cursor: 'pointer',
              border: selectedScenario === 'student-treatment' ? '2px solid var(--color-teal)' : '1px solid var(--color-border)',
              backgroundColor: selectedScenario === 'student-treatment' ? 'var(--color-teal-light)' : '#FFFFFF'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-mint)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <GraduationCap size={20} color="var(--color-teal)" />
              </div>
              <h3 style={{ fontSize: '1.0625rem', color: 'var(--color-navy)' }}>Student Scenario</h3>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-slate)' }}>
              Reporting unfair grading and retaliatory instructor remarks confidentially.
            </p>
          </button>

          <button
            onClick={() => setSelectedScenario('public-service-delay')}
            className={`card ${selectedScenario === 'public-service-delay' ? 'active-scenario' : ''}`}
            style={{
              textAlign: 'left',
              cursor: 'pointer',
              border: selectedScenario === 'public-service-delay' ? '2px solid var(--color-teal)' : '1px solid var(--color-border)',
              backgroundColor: selectedScenario === 'public-service-delay' ? 'var(--color-teal-light)' : '#FFFFFF'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#EBF3F8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Building2 size={20} color="var(--color-navy)" />
              </div>
              <h3 style={{ fontSize: '1.0625rem', color: 'var(--color-navy)' }}>Public-Service Delay</h3>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-slate)' }}>
              Structuring a complaint regarding municipal licensing delay without personal exposure.
            </p>
          </button>
        </div>

        {/* Current Scenario Walkthrough View */}
        {current && (
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-teal)' }}>
                  Synthetic Persona: {current.persona}
                </span>
                <h2 style={{ fontSize: '1.375rem', marginTop: '0.25rem' }}>{current.title}</h2>
              </div>
              <span className="badge badge-under-review">{current.category}</span>
            </div>

            {/* Problem narrative */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                Synthetic Problem Narrative:
              </h4>
              <div
                style={{
                  backgroundColor: 'var(--color-ivory)',
                  border: '1px solid var(--color-border)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9375rem',
                  color: 'var(--color-navy)',
                  lineHeight: 1.6
                }}
              >
                {current.sampleDescription}
              </div>
            </div>

            {/* Context specifics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.75rem', fontSize: '0.875rem' }}>
              <div>
                <strong>Jurisdiction / Location:</strong>
                <div style={{ color: 'var(--color-slate)', marginTop: '0.25rem' }}>{current.departmentOrLocation}</div>
              </div>
              <div>
                <strong>Requested Resolution:</strong>
                <div style={{ color: 'var(--color-slate)', marginTop: '0.25rem' }}>{current.requestedResolution}</div>
              </div>
            </div>

            {/* Workflow steps */}
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '1rem' }}>
              How UNSEEN Resolves This Workflow Privately:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem' }}>
              {Object.entries(current.workflowDemonstration || {}).map(([key, desc], index) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.875rem',
                    backgroundColor: '#FAFBFB',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-mint)',
                      color: 'var(--color-teal)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      flexShrink: 0
                    }}
                  >
                    {index + 1}
                  </div>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-navy)' }}>{desc}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link to="/submit" className="btn btn-primary btn-lg">
                Try Reporting Flow Yourself <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
