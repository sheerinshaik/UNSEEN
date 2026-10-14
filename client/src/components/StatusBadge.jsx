import React from 'react';

export function StatusBadge({ status }) {
  const normalized = (status || '').toLowerCase().replace(/\s+/g, '-');
  let badgeClass = 'badge-submitted';

  if (normalized === 'under-review') {
    badgeClass = 'badge-under-review';
  } else if (normalized === 'action-required') {
    badgeClass = 'badge-action-required';
  } else if (normalized === 'resolved') {
    badgeClass = 'badge-resolved';
  } else if (normalized === 'closed') {
    badgeClass = 'badge-closed';
  }

  return <span className={`badge ${badgeClass}`}>{status}</span>;
}
