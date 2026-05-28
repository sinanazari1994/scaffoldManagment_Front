import React from 'react';

export default function Header({ title, onBack, isOnline = true }) {
  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {onBack ? (
          <button onClick={onBack} className="btn btn-g" aria-label="بازگشت">
            ➡️
          </button>
        ) : (
          <div className="brand-mark" style={{ width: 36, height: 36, borderRadius: 'var(--rs)', background: 'var(--ora)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 }}>
            C
          </div>
        )}
        <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--tx)' }}>{title}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: isOnline ? 'var(--green)' : 'var(--red)' }} />
        <div className="avatar-circle" style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--ora)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
          {/* first letter of user name – injected by parent */}
        </div>
      </div>
    </header>
  );
}

// Helper to get first letter from user name (used in parent)
export function getInitial(name) {
  return name?.charAt(0) || '؟';
}