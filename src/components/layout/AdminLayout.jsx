import { NavLink, useNavigate } from 'react-router-dom';
import Icon from '../ui/Icon';
import { useAuth } from '../../contexts/AuthContext';

const sidebarItems = [
  { path: '/admin/dashboard', label: 'داشبورد', icon: 'home' },
  { path: '/admin/tenants', label: 'پیمانکاران', icon: 'users' },
  { path: '/admin/tenant-reports', label: 'گزارش پیمانکاران', icon: 'chart', role: 'SuperAdmin' },
  { path: '/admin/receipts', label: 'فیش‌های واریزی', icon: 'invoice' },   // جدید
  { path: '/admin/subscription-plans', label: 'پلن‌های اشتراک', icon: 'chart', role: 'SuperAdmin' }, // جدید
  { path: '/admin/reports', label: 'گزارشات', icon: 'chart', role: 'SuperAdmin' },
  { path: '/admin/support', label: 'کاربران پشتیبانی', icon: 'user', role: 'SuperAdmin' },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-[var(--bg)]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l border-[var(--border)] flex flex-col">
        <div className="p-4 border-b border-[var(--border)]">
          <h1 className="text-xl font-black text-[var(--ora)]">CHOOMA Admin</h1>
          <p className="text-xs text-[var(--t3)] mt-1">{user?.fullName}</p>
        </div>
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {sidebarItems
            .filter(item => !item.role || user?.role === item.role)
            .map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                    isActive ? 'bg-[var(--ora-g)] text-[var(--ora)]' : 'text-[var(--t3)] hover:bg-[var(--bg2)]'
                  }`
                }
              >
                <Icon name={item.icon} size={20} />
                {item.label}
              </NavLink>
            ))}
        </nav>
        <div className="p-3 border-t border-[var(--border)]">
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="btn btn-sm btn-g w-full justify-start"
          >
            <Icon name="logout" size={16} /> خروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}