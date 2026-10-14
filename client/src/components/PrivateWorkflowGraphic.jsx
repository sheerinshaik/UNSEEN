import React from 'react';
import { ShieldCheck, UserCheck, EyeOff, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

export function PrivateWorkflowGraphic() {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        boxShadow: 'var(--shadow-md)',
        marginTop: '2.5rem'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
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
          Protected Flow Architecture
        </span>
        <h4 style={{ marginTop: '0.5rem', color: 'var(--color-navy)', fontSize: '1.125rem' }}>
          Identity Decoupling at the Ingestion Boundary
        </h4>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          alignItems: 'stretch'
        }}
      >
        {/* Step 1: Submitter */}
        <div
          style={{
            backgroundColor: '#FAFBFB',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#EBF3F8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <UserCheck size={18} color="var(--color-navy)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-navy)' }}>
                Authenticated Submitter
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>Account Verified</div>
            </div>
          </div>
          <ul style={{ listStyle: 'none', fontSize: '0.8125rem', color: 'var(--color-slate)', spaceY: '0.35rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
              <CheckCircle2 size={14} color="var(--color-teal)" /> Narrative Problem Description
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
              <CheckCircle2 size={14} color="var(--color-teal)" /> Category & Optional Context
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Lock size={14} color="var(--color-amber)" /> Account Email (Private Session)
            </li>
          </ul>
        </div>

        {/* Step 2: Privacy Filter */}
        <div
          style={{
            backgroundColor: 'var(--color-mint)',
            border: '1px solid #BFE2D5',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <EyeOff size={18} color="var(--color-teal)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-navy)' }}>
                Identity Boundary
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-teal)' }}>Zero-Linkage Pipeline</div>
            </div>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-navy)', lineHeight: 1.4 }}>
            <div style={{ marginBottom: '0.375rem' }}>
              <strong>Strips:</strong> Email, User ID, IP Hash, Password Hash.
            </div>
            <div>
              <strong>Issues:</strong> Cryptographic Reference & One-Time Tracking Secret.
            </div>
          </div>
        </div>

        {/* Step 3: Reviewer Workspace */}
        <div
          style={{
            backgroundColor: '#FAFBFB',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#EBF3F8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldCheck size={18} color="var(--color-teal)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-navy)' }}>
                Authorized Reviewer
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>Confidential Handling</div>
            </div>
          </div>
          <ul style={{ listStyle: 'none', fontSize: '0.8125rem', color: 'var(--color-slate)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
              <CheckCircle2 size={14} color="var(--color-teal)" /> Reads issue narrative
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
              <CheckCircle2 size={14} color="var(--color-teal)" /> Updates resolution status
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <span style={{ color: 'var(--color-red)', fontWeight: 600 }}>✕ No submitter identity exposed</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
