import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';

export default function AdminTenantReport() {
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  // دریافت لیست پیمانکاران
  useEffect(() => {
    api.get(ENDPOINTS.ADMIN_TENANTS)
      .then(res => setTenants(res.data.items || res.data))
      .catch(console.error);
  }, []);

  const fetchReport = async (tenantId) => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/tenant-reports/${tenantId}`);
      setReport(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const id = e.target.value;
    setSelectedTenant(id);
    if (id) fetchReport(id);
    else setReport(null);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-black mb-6">گزارش پیمانکاران</h1>

      {/* انتخاب پیمانکار */}
      <div className="card max-w-md mb-6">
        <div className="fg">
          <label className="fl">انتخاب پیمانکار</label>
          <select className="fi" value={selectedTenant} onChange={handleChange}>
            <option value="">-- انتخاب کنید --</option>
            {tenants.map(t => (
              <option key={t.id} value={t.id}>{t.companyName}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="text-center py-10">در حال بارگذاری...</p>}

      {report && !loading && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">{report.tenantName}</h2>

          {/* کارت‌های آماری */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="انبارها" value={report.warehouseCount} />
            <StatCard label="پروژه‌های فعال" value={report.activeProjects} />
            <StatCard label="پروژه‌های تکمیل‌شده" value={report.completedProjects} />
            <StatCard label="کل کاربران" value={report.totalUsers} />
            {report.workers > 0 && <StatCard label="کارگران" value={report.workers} />}
            {report.contractors > 0 && <StatCard label="پیمانکاران" value={report.contractors} />}
            {report.managers > 0 && <StatCard label="مدیران دفتر" value={report.managers} />}
          </div>

          {/* تجهیزات */}
          <div className="card">
            <h3 className="font-bold text-lg mb-3">📦 تجهیزات</h3>
            {report.equipment.length === 0 ? (
              <p className="text-sm text-[var(--t3)]">تجهیزاتی ثبت نشده است</p>
            ) : (
              <div className="space-y-2">
                {report.equipment.map(eq => (
                  <div
                    key={eq.equipmentTypeId}
                    className="flex justify-between items-center bg-[var(--bg2)] rounded-lg p-3"
                  >
                    <span className="font-medium">{eq.equipmentName}</span>
                    <span className="font-bold text-[var(--ora)]">{eq.totalQuantity} عدد</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// کامپوننت کمکی
function StatCard({ label, value }) {
  return (
    <div className="card text-center">
      <p className="text-sm text-[var(--t3)] mb-2">{label}</p>
      <p className="text-3xl font-black">{value}</p>
    </div>
  );
}