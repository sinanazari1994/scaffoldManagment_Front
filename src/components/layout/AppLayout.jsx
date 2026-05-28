import React from 'react';
import Topbar from './Topbar';
import Screen from './Screen';
import Tabbar from './Tabbar';
import { useAuth } from '../../contexts/AuthContext';

export default function AppLayout({ title, onBack, children }) {
  const { user } = useAuth();
  // نوار پایین برای همه (حتی کارگر) نمایش داده می‌شود
  const shouldShowNav = !!user;

  return (
    <div className="flex flex-col h-full">
      <Topbar title={title} onBack={onBack} />
      <Screen>{children}</Screen>
      {shouldShowNav && <Tabbar />}
    </div>
  );
}