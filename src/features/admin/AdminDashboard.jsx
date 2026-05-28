import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Icon from '../../components/ui/Icon';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(ENDPOINTS.ADMIN_STATS)
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><div className="text-center py-20 text-xl">در حال بارگذاری...</div></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-black mb-8">داشبورد مدیریت</h1>

      {/* کارت‌های آماری */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard icon="users" color="var(--ora)" label="پیمانکاران" value={stats?.totalTenants ?? 0} sub={`${stats?.activeTenants ?? 0} فعال`} />
        <StatCard icon="folder" color="var(--steel)" label="پروژه‌ها" value={stats?.totalProjects ?? 0} sub={`${stats?.activeProjects ?? 0} فعال`} />
        <StatCard icon="user" color="var(--green)" label="کاربران" value={stats?.totalUsers ?? 0} sub={`${stats?.totalWorkers ?? 0} کارگر`} />
        <StatCard icon="hardhat" color="var(--amber)" label="حجم نصب" value={stats?.totalInstalledVolume?.toFixed(1) ?? 0} sub="مترمکعب" />
      </div>

      {/* نمودار ساده (اختیاری) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold text-lg mb-4">نمودار وضعیت پروژه‌ها</h3>
          <SimpleBarChart active={stats?.activeProjects ?? 0} total={stats?.totalProjects ?? 0} />
        </div>
        <div className="card">
          <h3 className="font-bold text-lg mb-4">راهنمای سریع</h3>
          <ul className="space-y-2 text-sm text-[var(--t2)]">
            <li>• از بخش «پیمانکاران» می‌توانید شرکت‌ها را مدیریت کنید.</li>
            <li>• برای فعال‌سازی اشتراک، روی نام شرکت کلیک کنید.</li>
            <li>• گزارشات کلی سیستم فقط برای مدیر کل قابل مشاهده است.</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}

// کامپوننت کمکی کارت آمار
function StatCard({ icon, color, label, value, sub }) {
  return (
    <div className="card flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: color + '18' }}>
        <Icon name={icon} size={28} color={color} />
      </div>
      <div>
        <p className="text-3xl font-black">{value}</p>
        <p className="text-sm text-[var(--t3)]">{label}</p>
        {sub && <p className="text-xs text-[var(--t4)]">{sub}</p>}
      </div>
    </div>
  );
}

// نمودار میله‌ای ساده
function SimpleBarChart({ active, total }) {
  const inactive = total - active;
  const activePercent = total ? (active / total) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm">فعال</span>
        <div className="flex-1 h-5 bg-[var(--bg2)] rounded-full overflow-hidden">
          <div className="h-full bg-[var(--green)] rounded-full" style={{ width: `${activePercent}%` }} />
        </div>
        <span className="text-sm font-bold">{active}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">غیرفعال</span>
        <div className="flex-1 h-5 bg-[var(--bg2)] rounded-full overflow-hidden">
          <div className="h-full bg-[var(--border)] rounded-full" style={{ width: `${100 - activePercent}%` }} />
        </div>
        <span className="text-sm font-bold">{inactive}</span>
      </div>
    </div>
  );
}