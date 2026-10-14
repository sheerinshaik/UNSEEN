import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { Shield, Eye, EyeOff, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await login({ email: email.trim(), password });
      if (res.success) {
        showSuccess(`Welcome back, ${res.user.email}`);
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else if (res.user.role === 'reviewer') {
          navigate('/reviewer');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      showError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="section-sm">
      <div className="container" style={{ maxWidth: '440px' }}>
        <div className="card" style={{ padding: '2.25rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-teal)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <Shield size={22} color="#FFFFFF" />
            </div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>Sign in to UNSEEN</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-slate)' }}>
              Access your confidential reporting vault
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="loginEmail">
                Email Address
              </label>
              <input
                id="loginEmail"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="loginPass">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="loginPass"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-slate)',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.75rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Credentials Helper */}
          <div
            style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--color-border)'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-slate)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Quick Demo Personas (Click to autofill)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('citizen.demo@example.com', 'CitizenDemo2026!')}
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', fontSize: '0.75rem' }}
              >
                👤 Citizen Submitter (citizen.demo@example.com)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('ombuds@unseen.internal', 'ReviewerPass2026!')}
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', fontSize: '0.75rem' }}
              >
                🛡️ Reviewer Staff (ombuds@unseen.internal)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@unseen.internal', 'AdminSecure2026!')}
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', fontSize: '0.75rem' }}
              >
                ⚙️ Platform Admin (admin@unseen.internal)
              </button>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--color-slate)' }}>Don't have an account? </span>
            <Link to="/register" style={{ fontWeight: 600 }}>Create account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const { register } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      showError('Password must be at least 8 characters long.');
      return;
    }

    try {
      setLoading(true);
      const res = await register({ email: email.trim(), password });
      if (res.success) {
        showSuccess('Account successfully registered! Welcome to UNSEEN.');
        navigate('/dashboard');
      }
    } catch (err) {
      showError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-sm">
      <div className="container" style={{ maxWidth: '460px' }}>
        <div className="card" style={{ padding: '2.25rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-mint)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <UserCheck size={22} color="var(--color-teal)" />
            </div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>Create UNSEEN Account</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-slate)' }}>
              Enables return tracking to your private report vault
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="regEmail">
                Email Address
              </label>
              <input
                id="regEmail"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="form-helper">
                Used solely for account login. Excluded from reports reviewed by staff.
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="regPass">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="regPass"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Min 8 characters, Upper, Lower, Number"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-slate)',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="regConfirmPass">
                Confirm Password
              </label>
              <input
                id="regConfirmPass"
                type="password"
                className="form-input"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-slate)',
                lineHeight: 1.4,
                marginBottom: '1.25rem'
              }}
            >
              By registering, you acknowledge that UNSEEN is an independent technical platform and agree to our{' '}
              <Link to="/terms">Terms of Use</Link> and{' '}
              <Link to="/privacy">Privacy Architecture</Link>.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              {loading ? 'Creating Account...' : 'Register Secure Account'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--color-slate)' }}>Already have an account? </span>
            <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
