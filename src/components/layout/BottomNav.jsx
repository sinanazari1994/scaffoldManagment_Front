import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { path: '/worker/dashboard', label: 'کارها', icon: '📋' },
  { path: '/worker/tasks',     label: 'تسک‌ها', icon: '📦' },
  { path: '/worker/more',      label: 'بیشتر', icon: '⋯' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="tabbar">
      {tabs.map(tab => {
        const active = location.pathname.startsWith(tab.path);
        return (
          <button
            key={tab.path}
            className={`ti ${active ? 'active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <div className="indicator" />
            <span style={{ fontSize: 22, lineHeight: 1 }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}