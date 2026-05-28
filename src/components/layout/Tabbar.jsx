import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../ui/Icon';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES } from '../../lib/constants';

// تب‌های کارگر (فقط عملیات و انبارها)
const workerTabs = [
  { path: '/worker/dashboard', label: 'عملیات', icon: 'hardhat' },
  { path: '/worker/warehouses', label: 'انبارها', icon: 'box' },
];

// تب‌های مدیر (داشبورد، پروژه‌ها، انبارها، عملیات، کاربران)
const managerTabs = [
  { path: '/manager/dashboard', label: 'داشبورد', icon: 'home' },
  { path: '/manager/warehouses', label: 'انبارها', icon: 'box' },
  { path: '/manager/operations', label: 'عملیات', icon: 'hardhat' },
  { path: '/manager/projects', label: 'پروژه‌ها', icon: 'folder' },
  { path: '/manager/more', label: 'بیشتر', icon: 'users' },   // یا می‌توانید آیکن متفاوتی بدهید
];

export default function Tabbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const tabs = user?.role === ROLES.WORKER ? workerTabs : managerTabs;

  return (
    <nav className="tabbar">
      {tabs.map(tab => {
        const active = location.pathname.startsWith(tab.path);
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`ti${active ? ' on' : ''}`}
          >
            {active && <span className="ti-pill" />}
            <Icon name={tab.icon} size={22} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}