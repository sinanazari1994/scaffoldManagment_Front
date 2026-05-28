import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import { toJalali } from '../../lib/dateHelpers';

export default function AdminReports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(ENDPOINTS.ADMIN_STATS)
      .then(res => setReport(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><p className="text-center py-10">در حال بارگذاری...</p></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-black mb-6">گزارشات کلی سیستم</h1>
      {!report ? (
        <p>اطلاعاتی یافت نشد</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <h3 className="font-bold text-lg mb-3">پیمانکاران</h3>
            <p>کل: {report.totalTenants}</p>
            <p>فعال: {report.activeTenants}</p>
          </div>
          <div className="card">
            <h3 className="font-bold text-lg mb-3">پروژه‌ها</h3>
            <p>کل: {report.totalProjects}</p>
            <p>فعال: {report.activeProjects}</p>
          </div>
          <div className="card">
            <h3 className="font-bold text-lg mb-3">کاربران</h3>
            <p>کل: {report.totalUsers}</p>
            <p>کارگران: {report.totalWorkers}</p>
          </div>
          <div className="card">
            <h3 className="font-bold text-lg mb-3">حجم کل نصب</h3>
            <p className="text-2xl font-black">{report.totalInstalledVolume?.toFixed(2)} m³</p>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}