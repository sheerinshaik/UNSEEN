import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--color-border)',
        padding: '4rem 0 2.5rem',
        marginTop: 'auto'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem'
          }}
        >
          {/* Brand Col */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-teal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Shield size={16} color="#FFFFFF" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--color-navy)' }}>UNSEEN</span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1rem' }}>
              Your voice matters. Your identity doesn't have to be public.
            </p>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-slate)' }}>
              A privacy-first platform for confidential concern reporting.
            </div>
          </div>

          {/* Nav Col 1: Platform */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '1rem' }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/#how-it-works">How it works</Link>
              </li>
              <li>
                <Link to="/submit">Report a concern</Link>
              </li>
              <li>
                <Link to="/track">Private Tracking</Link>
              </li>
              <li>
                <Link to="/scenarios">Demonstration Scenarios</Link>
              </li>
              <li>
                <Link to="/selective-disclosure">Selective Disclosure Demo</Link>
              </li>
            </ul>
          </div>

          {/* Nav Col 2: Principles & Privacy */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '1rem' }}>
              Trust & Privacy
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/privacy#identity-protection">Identity Decoupling</Link>
              </li>
              <li>
                <Link to="/privacy#responsible-reporting">Responsible Reporting</Link>
              </li>
              <li>
                <Link to="/terms">Terms of Use</Link>
              </li>
              <li>
                <Link to="/privacy#limitations">Project Limitations</Link>
              </li>
            </ul>
          </div>

          {/* Nav Col 3: Support & Contact */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '1rem' }}>
              Contact & Oversight
            </h4>
            <p style={{ fontSize: '0.8125rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Support channel for authorized institution deployment and technical inquiries:
            </p>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-navy)', fontWeight: 600 }}>
              support@unseen.internal
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--color-slate)', lineHeight: 1.4 }}>
              Notice: UNSEEN is an independent technical platform. It does not file official police or judicial reports.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.8125rem',
            color: 'var(--color-slate)'
          }}
        >
          <div>&copy; {new Date().getFullYear()} UNSEEN. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy#limitations">Limitations</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
