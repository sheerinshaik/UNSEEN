import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback((type, message, duration = 4000) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setNotifications((prev) => [...prev, { id, type, message }]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, [removeNotification]);

  const showSuccess = useCallback((msg, duration) => addNotification('success', msg, duration), [addNotification]);
  const showError = useCallback((msg, duration) => addNotification('error', msg, duration), [addNotification]);
  const showInfo = useCallback((msg, duration) => addNotification('info', msg, duration), [addNotification]);

  return (
    <NotificationContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: '1.25rem',
          right: '1.25rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxWidth: '420px',
          width: 'calc(100% - 2.5rem)',
          pointerEvents: 'none'
        }}
      >
        {notifications.map((n) => (
          <div
            key={n.id}
            role="status"
            aria-live="polite"
            style={{
              pointerEvents: 'auto',
              backgroundColor: '#FFFFFF',
              border: `1px solid ${
                n.type === 'success'
                  ? 'var(--color-success-border)'
                  : n.type === 'error'
                  ? 'var(--color-red-border)'
                  : 'var(--color-border)'
              }`,
              borderRadius: 'var(--radius-md)',
              padding: '0.875rem 1rem',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              {n.type === 'success' && <CheckCircle2 size={18} color="var(--color-teal)" />}
              {n.type === 'error' && <AlertCircle size={18} color="var(--color-red)" />}
              {n.type === 'info' && <Info size={18} color="var(--color-navy)" />}
              <span style={{ fontSize: '0.875rem', color: 'var(--color-navy)', fontWeight: 500 }}>
                {n.message}
              </span>
            </div>
            <button
              onClick={() => removeNotification(n.id)}
              aria-label="Dismiss notification"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-slate)',
                display: 'flex',
                padding: '2px'
              }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
