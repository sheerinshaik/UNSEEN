import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';

import { LandingPage } from './pages/LandingPage.jsx';
import { SubmitReportPage } from './pages/SubmitReportPage.jsx';
import { TrackReportPage } from './pages/TrackReportPage.jsx';
import { UserDashboardPage } from './pages/UserDashboardPage.jsx';
import { ReviewerDashboardPage } from './pages/ReviewerDashboardPage.jsx';
import { AdminPage } from './pages/AdminPage.jsx';
import { ScenariosPage } from './pages/ScenariosPage.jsx';
import { SelectiveDisclosureDemoPage } from './pages/SelectiveDisclosureDemoPage.jsx';
import { LoginPage, RegisterPage } from './pages/AuthPages.jsx';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage.jsx';
import { TermsPage, NotFoundPage } from './pages/TermsPage.jsx';

// Protected Route Guard for Authenticated Users
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="section" style={{ textAlign: 'center' }}>
        <p>Validating confidential session...</p>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Protected Route Guard for Reviewer / Admin
function ReviewerRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="section" style={{ textAlign: 'center' }}>
        <p>Validating reviewer credentials...</p>
      </div>
    );
  }
  if (!user || (user.role !== 'reviewer' && user.role !== 'admin')) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

// Protected Route Guard for Admin Only
function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="section" style={{ textAlign: 'center' }}>
        <p>Validating administrator authority...</p>
      </div>
    );
  }
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <div className="main-content">
              <Routes>
                {/* Public Platform Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/submit" element={<SubmitReportPage />} />
                <Route path="/track" element={<TrackReportPage />} />
                <Route path="/scenarios" element={<ScenariosPage />} />
                <Route path="/selective-disclosure" element={<SelectiveDisclosureDemoPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />

                {/* Authentication Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Citizen Vault Route */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <UserDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Reviewer Workspace */}
                <Route
                  path="/reviewer"
                  element={
                    <ReviewerRoute>
                      <ReviewerDashboardPage />
                    </ReviewerRoute>
                  }
                />

                {/* Restricted Admin Center */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  }
                />

                {/* 404 Custom Fallback */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
