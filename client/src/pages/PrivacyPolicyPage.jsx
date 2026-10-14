import React from 'react';
import { Shield, EyeOff, Lock, AlertTriangle, Layers, FileCheck } from 'lucide-react';

export function PrivacyPolicyPage() {
  return (
    <div className="section-sm">
      <div className="container" style={{ maxWidth: '840px' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-teal)'
            }}
          >
            Technical Disclosure
          </span>
          <h1 style={{ fontSize: '2rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
            UNSEEN Privacy Architecture & Policy
          </h1>
          <p style={{ color: 'var(--color-slate)', fontSize: '0.9375rem' }}>
            Precise documentation of what we collect, how identity boundaries are enforced, and known threat boundaries.
          </p>
        </div>

        <div className="card" style={{ padding: '2.25rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }} id="identity-protection">
            1. Strong Identity Separation
          </h2>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            In traditional reporting platforms, submitter accounts are directly joined to ticket records in the reviewer database. UNSEEN enforces strict structural separation:
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            <li style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ color: 'var(--color-teal)', fontWeight: 700 }}>•</span>
              <div>
                <strong>Zero Account Identifiers in Reports:</strong> The Report document model stores category, narrative description, incident period, and requested resolution. It contains no <code>userId</code>, <code>email</code>, <code>name</code>, or <code>ipAddress</code>.
              </div>
            </li>
            <li style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ color: 'var(--color-teal)', fontWeight: 700 }}>•</span>
              <div>
                <strong>Non-Sequential Public References:</strong> Public references (e.g., <code>UNS-XXXX-XXXX-XXXX</code>) are generated via cryptographically random base32 chunking. They cannot be used to infer submission frequency or sequence.
              </div>
            </li>
            <li style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ color: 'var(--color-teal)', fontWeight: 700 }}>•</span>
              <div>
                <strong>Isolated Private Vault:</strong> When an authenticated user submits a report, the association is recorded exclusively in an isolated <code>UserVault</code> collection, strictly restricted to the citizen's own session. Reviewers and admins have no access to this table.
              </div>
            </li>
          </ul>

          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
            2. Cryptographic Tracking Secrets
          </h2>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            For submitters who wish to track a concern without an account, UNSEEN issues a high-entropy 192-bit tracking secret upon submission.
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-slate)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            The server hashes this secret using a salted SHA-256 HMAC before persistence. Possession of the public reference alone does not authorize access. The plaintext secret is never logged and cannot be recovered if forgotten.
          </p>

          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }} id="responsible-reporting">
            3. Responsible Reporting Code
          </h2>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            UNSEEN is built to protect vulnerable individuals from retaliation while preserving institutional accountability. We ask users to:
          </p>
          <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', fontSize: '0.875rem', color: 'var(--color-slate)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <li>Submit truthful, factual narratives without fabricating malicious falsehoods.</li>
            <li>Avoid including extraneous personal identifying details (e.g., telephone numbers, home addresses) in narrative text.</li>
            <li>Respect that urgent emergencies (immediate physical threats, severe medical emergencies) require contacting local emergency response services immediately.</li>
          </ul>

          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }} id="limitations">
            4. Project Limitations & Threat Model
          </h2>
          <div className="alert alert-warning" style={{ marginBottom: '1rem' }}>
            <AlertTriangle size={20} style={{ flexShrink: 0 }} />
            <div>
              <strong>Realistic Privacy Disclosure:</strong> UNSEEN does not claim absolute anonymity against every state-level or physical infrastructure threat.
            </div>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-slate)', lineHeight: 1.6 }}>
            Users should understand that:
          </p>
          <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', fontSize: '0.875rem', color: 'var(--color-slate)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            <li>Reviewers can infer identity if narrative descriptions contain rare, unique circumstances or names.</li>
            <li>Adversaries with physical server access or compromised hosting hypervisors could theoretically log network packets.</li>
            <li>UNSEEN is an independent technical demonstration and does not constitute a legally privileged attorney-client or court channel.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
