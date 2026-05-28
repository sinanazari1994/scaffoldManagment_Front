import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Icon from '../../components/ui/Icon';

const menuItems = [
  { path: '/manager/workers', label: 'کاربران', icon: 'users' },
  { path: '/manager/invoice', label: 'فاکتورها', icon: 'invoice' },
  { path: '/manager/reports', label: 'گزارشات', icon: 'chart' },
  { path: '/manager/transactions', label: 'تاریخچه', icon: 'clock' },
  { path: '/manager/services', label: 'خدمات', icon: 'hardhat' },
  { path: '/manager/equipment-types', label: 'تجهیزات', icon: 'box' },
];

export default function MorePage() {
  const navigate = useNavigate();

  return (
    <AppLayout title="بیشتر">
      <div className="p-4 max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-black text-[var(--tx)] mb-2">دسترسی‌های مدیریت</h2>
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="card flex flex-col items-center justify-center p-5 gap-3 active:scale-[0.97] transition-transform hover:border-[var(--ora)] hover:shadow-[var(--shadow-lg)]"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg2)] flex items-center justify-center">
                <Icon name={item.icon} size={30} color="var(--ora)" />
              </div>
              <span className="text-sm font-bold text-[var(--tx)]">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}