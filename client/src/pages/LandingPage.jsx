import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  EyeOff,
  Lock,
  ArrowRight,
  FileText,
  UserCheck,
  CheckCircle2,
  Clock,
  Layers,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { PrivateWorkflowGraphic } from '../components/PrivateWorkflowGraphic.jsx';

export function LandingPage() {
  return (
    <div className="landing-page">
      {/* 1. Hero Section */}
      <section
        className="section"
        style={{
          backgroundColor: 'var(--color-ivory)',
          borderBottom: '1px solid var(--color-border)',
          paddingTop: '4.5rem',
          paddingBottom: '4.5rem'
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '880px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--color-mint)',
              color: 'var(--color-teal)',
              padding: '0.35rem 0.875rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '1.5rem'
            }}
          >
            <ShieldCheck size={16} /> Privacy-First Problem Reporting
          </div>

          <h1 style={{ marginBottom: '1.25rem', color: 'var(--color-navy)' }}>
            Speak up about the problem. Keep your identity private.
          </h1>

          <p
            style={{
              fontSize: '1.1875rem',
              lineHeight: 1.6,
              color: 'var(--color-slate)',
              marginBottom: '2.25rem',
              maxWidth: '720px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            UNSEEN helps you explain a concern, control unnecessary information sharing, and follow its progress through a privacy-first reporting experience.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '3rem'
            }}
          >
            <Link to="/submit" className="btn btn-primary btn-lg">
              Report a concern <ArrowRight size={18} />
            </Link>
            <a href="#how-privacy-works" className="btn btn-secondary btn-lg">
              How privacy works
            </a>
          </div>

          {/* Tasteful Protected Workflow Visual */}
          <PrivateWorkflowGraphic />
        </div>
      </section>

      {/* 2. Trust and Privacy Section */}
      <section id="how-privacy-works" className="section" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-teal)'
              }}
            >
              Architectural Commitments
            </span>
            <h2 style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>Three Core Privacy Principles</h2>
            <p>
              We design software so privacy is enforced by backend boundaries, not just marketing promises.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {/* Principle 1 */}
            <div className="card">
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-mint)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <EyeOff size={22} color="var(--color-teal)" />
              </div>
              <h3 style={{ fontSize: '1.1875rem', marginBottom: '0.75rem' }}>1. Identity Protection</h3>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Account details—including email, name, user IDs, and password hashes—are never displayed to ordinary report reviewers or department evaluators.
              </p>
            </div>

            {/* Principle 2 */}
            <div className="card">
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-mint)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <Layers size={22} color="var(--color-teal)" />
              </div>
              <h3 style={{ fontSize: '1.1875rem', marginBottom: '0.75rem' }}>2. Information Minimization</h3>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Share only what is strictly necessary for resolution. Optional fields allow context without requiring names, phone numbers, or government identifiers.
              </p>
            </div>

            {/* Principle 3 */}
            <div className="card">
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-mint)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <Lock size={22} color="var(--color-teal)" />
              </div>
              <h3 style={{ fontSize: '1.1875rem', marginBottom: '0.75rem' }}>3. Private Tracking</h3>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Users can securely return to follow progress using cryptographic one-time tracking secrets or their personal authenticated vault without public linkages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works (Visual Stepper) */}
      <section id="how-it-works" className="section" style={{ backgroundColor: 'var(--color-ivory)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-teal)'
              }}
            >
              Step-by-Step Reporting
            </span>
            <h2 style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>How UNSEEN Works</h2>
            <p>From initial draft to official resolution in four straightforward steps.</p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem'
            }}
          >
            <div className="card" style={{ borderTop: '3px solid var(--color-teal)' }}>
              <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-teal)', marginBottom: '0.5rem' }}>
                01
              </div>
              <h4 style={{ fontSize: '1.0625rem', marginBottom: '0.5rem' }}>Sign in securely</h4>
              <p style={{ fontSize: '0.875rem' }}>
                Authenticate with your email and password to maintain an encrypted session.
              </p>
            </div>

            <div className="card" style={{ borderTop: '3px solid var(--color-teal)' }}>
              <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-teal)', marginBottom: '0.5rem' }}>
                02
              </div>
              <h4 style={{ fontSize: '1.0625rem', marginBottom: '0.5rem' }}>Describe the problem</h4>
              <p style={{ fontSize: '0.875rem' }}>
                Select a category and explain what happened in your own words, guided by privacy tips.
              </p>
            </div>

            <div className="card" style={{ borderTop: '3px solid var(--color-teal)' }}>
              <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-teal)', marginBottom: '0.5rem' }}>
                03
              </div>
              <h4 style={{ fontSize: '1.0625rem', marginBottom: '0.5rem' }}>Review disclosure</h4>
              <p style={{ fontSize: '0.875rem' }}>
                Inspect the explicit summary of what data will and will not be shared with reviewers.
              </p>
            </div>

            <div className="card" style={{ borderTop: '3px solid var(--color-teal)' }}>
              <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-teal)', marginBottom: '0.5rem' }}>
                04
              </div>
              <h4 style={{ fontSize: '1.0625rem', marginBottom: '0.5rem' }}>Submit & track</h4>
              <p style={{ fontSize: '0.875rem' }}>
                Receive a random non-sequential reference and private secret to check responses anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Use Cases */}
      <section className="section" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-teal)'
              }}
            >
              Practical Applications
            </span>
            <h2 style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>Designed for High-Stakes Reporting</h2>
            <p>
              These examples illustrate potential use cases where personal identity disclosure creates fear of retaliation or administrative disadvantage.
            </p>
            <div
              style={{
                display: 'inline-block',
                marginTop: '0.75rem',
                fontSize: '0.8125rem',
                backgroundColor: 'var(--color-amber-bg)',
                color: 'var(--color-amber)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-amber-border)'
              }}
            >
              Note: Examples illustrate potential use cases, not confirmed partnerships or official integrations.
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}
          >
            <div className="card">
              <h4 style={{ fontSize: '1.0625rem', marginBottom: '0.5rem' }}>Student Concerns</h4>
              <p style={{ fontSize: '0.875rem' }}>
                Report subjective grading discrepancies, laboratory safety violations, or retaliatory remarks without fear of academic penalty.
              </p>
            </div>

            <div className="card">
              <h4 style={{ fontSize: '1.0625rem', marginBottom: '0.5rem' }}>Unfair Treatment</h4>
              <p style={{ fontSize: '0.875rem' }}>
                Document discriminatory scheduling, hostile evaluation practices, or workplace bias without exposing your personal employee record.
              </p>
            </div>

            <div className="card">
              <h4 style={{ fontSize: '1.0625rem', marginBottom: '0.5rem' }}>Administrative Inconvenience</h4>
              <p style={{ fontSize: '0.875rem' }}>
                Flag repeated office delays, lost paperwork, or bureaucratic obstacles to department leadership anonymously.
              </p>
            </div>

            <div className="card">
              <h4 style={{ fontSize: '1.0625rem', marginBottom: '0.5rem' }}>Public-Service Delays</h4>
              <p style={{ fontSize: '0.875rem' }}>
                Highlight service bottlenecks and civic delays while shielding your individual application from retaliatory delays.
              </p>
            </div>

            <div className="card">
              <h4 style={{ fontSize: '1.0625rem', marginBottom: '0.5rem' }}>Privacy Concerns</h4>
              <p style={{ fontSize: '0.875rem' }}>
                Report exposed spreadsheets, unsecure noticeboards, or unauthorized data sharing within institutions safely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Privacy Explainer & Technical Boundaries */}
      <section
        className="section"
        style={{
          backgroundColor: 'var(--color-ivory)',
          borderTop: '1px solid var(--color-border)'
        }}
      >
        <div className="container" style={{ maxWidth: '840px' }}>
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
              Architectural Clarity
            </span>
            <h2 style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
              Authentication vs. Identity Disclosure
            </h2>
            <p>Understanding how UNSEEN separates account security from report review.</p>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '2rem'
            }}
          >
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <li style={{ display: 'flex', gap: '0.875rem' }}>
                <CheckCircle2 size={20} color="var(--color-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--color-navy)', display: 'block', marginBottom: '0.25rem' }}>
                    Authentication controls account access
                  </strong>
                  <p style={{ fontSize: '0.875rem' }}>
                    Logging in ensures you can securely return to view reports in your private dashboard and prevents unauthorized callers from impersonating your session.
                  </p>
                </div>
              </li>

              <li style={{ display: 'flex', gap: '0.875rem' }}>
                <CheckCircle2 size={20} color="var(--color-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--color-navy)', display: 'block', marginBottom: '0.25rem' }}>
                    Reports use cryptographically pseudonymous references
                  </strong>
                  <p style={{ fontSize: '0.875rem' }}>
                    Every report is assigned a randomized, non-sequential reference (such as <code>UNS-A9F4-8E2B-5C1D</code>) that carries zero mathematical relationship to your user ID or email.
                  </p>
                </div>
              </li>

              <li style={{ display: 'flex', gap: '0.875rem' }}>
                <CheckCircle2 size={20} color="var(--color-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--color-navy)', display: 'block', marginBottom: '0.25rem' }}>
                    Reviewers do not receive your account identity
                  </strong>
                  <p style={{ fontSize: '0.875rem' }}>
                    Our backend APIs deliberately omit submitter accounts, emails, and IP address records from reviewer endpoints. The report schema in the database does not contain a submitter identifier.
                  </p>
                </div>
              </li>

              <li style={{ display: 'flex', gap: '0.875rem' }}>
                <AlertTriangle size={20} color="var(--color-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--color-navy)', display: 'block', marginBottom: '0.25rem' }}>
                    Self-identifying details in narratives can still reveal identity
                  </strong>
                  <p style={{ fontSize: '0.875rem' }}>
                    If you include your name, specific office numbers, or rare personal circumstances in your written description, reviewers may infer who you are. We warn submitters to scrub personal details.
                  </p>
                </div>
              </li>
            </ul>

            <div
              className="alert alert-info"
              style={{ marginTop: '2rem', marginBottom: 0 }}
            >
              <HelpCircle size={20} style={{ flexShrink: 0 }} />
              <div>
                <strong>Independent Demonstration Platform Notice:</strong> UNSEEN is an independent technical demonstration and is not connected to government systems or official grievance databases unless an authenticated institutional integration is explicitly implemented.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA Footer Banner */}
      <section className="section-sm" style={{ backgroundColor: 'var(--color-navy)', color: '#FFFFFF' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#FFFFFF', marginBottom: '1rem' }}>Ready to submit a confidential report?</h2>
          <p style={{ color: '#A0B0BA', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Explain your concern with confidence. Review all information disclosures before anything is transmitted.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/submit" className="btn btn-primary btn-lg">
              Start report now <ArrowRight size={18} />
            </Link>
            <Link to="/track" className="btn btn-secondary btn-lg">
              Track existing report
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
