import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../ui/Icon';

export default function Topbar({ title, onBack }) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();                          // پاک‌سازی localStorage و state
    window.location.href = '/login';   // بارگذاری کامل صفحه و رفتن به صفحه ورود
  };

  return (
    <header className="topbar">
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="btn btn-g btn-xs p-1">
            <Icon name="back" size={20} color="var(--t2)" />
          </button>
        )}
        <span className="text-base font-bold text-[var(--tx)]">{title || 'داربست'}</span>
      </div>

      <button
        onClick={handleLogout}
        className="btn btn-g btn-xs px-3 py-1.5 text-xs font-bold text-[var(--t2)] hover:text-[var(--red)] transition-colors"
        title="خروج"
      >
        <Icon name="logout" size={18} />
        <span className="hidden sm:inline mr-1">خروج</span>
      </button>
    </header>
  );
}