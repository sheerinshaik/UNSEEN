import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Shield, Menu, X, PlusCircle, Search, User, LogOut, CheckSquare } from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, isReviewer, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4.25rem'
        }}
      >
        {/* Left: UNSEEN Wordmark + Privacy Shield */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            color: 'var(--color-navy)',
            fontWeight: 800,
            fontSize: '1.375rem',
            letterSpacing: '-0.02em',
            textDecoration: 'none'
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-teal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Shield size={20} color="#FFFFFF" strokeWidth={2.5} />
          </div>
          <span>UNSEEN</span>
        </Link>

        {/* Center Navigation - Desktop */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.75rem'
          }}
          className="desktop-nav"
        >
          <Link
            to="/#how-it-works"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: 'var(--color-slate)'
            }}
          >
            How it works
          </Link>
          <Link
            to="/privacy"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: isActive('/privacy') ? 'var(--color-teal)' : 'var(--color-slate)'
            }}
          >
            Privacy
          </Link>
          <Link
            to="/scenarios"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: isActive('/scenarios') ? 'var(--color-teal)' : 'var(--color-slate)'
            }}
          >
            Use cases
          </Link>
          <Link
            to="/selective-disclosure"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: isActive('/selective-disclosure') ? 'var(--color-teal)' : 'var(--color-slate)'
            }}
          >
            Demo Proof
          </Link>
          <Link
            to="/track"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: isActive('/track') ? 'var(--color-teal)' : 'var(--color-slate)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem'
            }}
          >
            <Search size={15} /> Track
          </Link>
        </nav>

        {/* Right Actions - Desktop */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.875rem'
          }}
          className="desktop-actions"
        >
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="btn btn-secondary btn-sm">
                  Admin
                </Link>
              )}
              {isReviewer && (
                <Link to="/reviewer" className="btn btn-secondary btn-sm">
                  Reviewer Workspace
                </Link>
              )}
              <Link to="/dashboard" className="btn btn-secondary btn-sm">
                <User size={15} /> My Reports
              </Link>
              <Link to="/submit" className="btn btn-primary btn-sm">
                <PlusCircle size={15} /> Report a concern
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm" title="Sign out">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Sign in
              </Link>
              <Link to="/submit" className="btn btn-primary btn-sm">
                Report a concern
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="mobile-toggle"
          style={{
            background: 'none',
            border: 'none',
            padding: '0.5rem',
            color: 'var(--color-navy)',
            cursor: 'pointer',
            display: 'none'
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid var(--color-border)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <Link
            to="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 500, color: 'var(--color-navy)' }}
          >
            How it works
          </Link>
          <Link
            to="/privacy"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 500, color: 'var(--color-navy)' }}
          >
            Privacy
          </Link>
          <Link
            to="/scenarios"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 500, color: 'var(--color-navy)' }}
          >
            Use cases & Scenarios
          </Link>
          <Link
            to="/selective-disclosure"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 500, color: 'var(--color-navy)' }}
          >
            Selective Disclosure Demo
          </Link>
          <Link
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 500, color: 'var(--color-navy)' }}
          >
            Track Report
          </Link>
          <hr style={{ borderColor: 'var(--color-border)', margin: '0.5rem 0' }} />
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary">
                  Admin Center
                </Link>
              )}
              {isReviewer && (
                <Link to="/reviewer" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary">
                  Reviewer Workspace
                </Link>
              )}
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary">
                My Reports
              </Link>
              <Link to="/submit" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary">
                Report a concern
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                <LogOut size={16} /> Sign out ({user?.email})
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary">
                Sign in
              </Link>
              <Link to="/submit" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary">
                Report a concern
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 768px) {
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
}
