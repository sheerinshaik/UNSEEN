import React from 'react';
import { Link } from 'react-router-dom';

export function TermsPage() {
  return (
    <div className="section-sm">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: '1.875rem', marginBottom: '1rem' }}>Terms of Use</h1>
        <p style={{ color: 'var(--color-slate)', marginBottom: '2rem' }}>
          Last updated: October 2026
        </p>

        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9375rem', lineHeight: 1.6 }}>
          <section>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>1. Nature of the Platform</h3>
            <p style={{ color: 'var(--color-slate)' }}>
              UNSEEN is an independent technical platform for confidential problem reporting. Submitting a report does not constitute the filing of an official police report, statutory grievance writ, or formal judicial proceeding.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>2. Acceptable Use</h3>
            <p style={{ color: 'var(--color-slate)' }}>
              You agree to use UNSEEN solely for legitimate reports of uncomfortable experiences, administrative delays, unfair treatment, or privacy concerns. You must not submit automated spam, distribute malware, or submit knowingly defamatory accusations.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>3. Limitation of Liability</h3>
            <p style={{ color: 'var(--color-slate)' }}>
              UNSEEN is provided on an "as is" and "as available" basis. While we enforce cryptographic and architectural privacy controls, we do not guarantee specific turnaround times by recipient institutions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="section" style={{ textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '500px' }}>
        <h1 style={{ fontSize: '4rem', color: 'var(--color-teal)', marginBottom: '0.5rem' }}>404</h1>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--color-slate)', marginBottom: '2rem' }}>
          The requested page or resource does not exist on UNSEEN.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/" className="btn btn-primary">
            Return to Homepage
          </Link>
          <Link to="/track" className="btn btn-secondary">
            Track a Report
          </Link>
        </div>
      </div>
    </div>
  );
}
