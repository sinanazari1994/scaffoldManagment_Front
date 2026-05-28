import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';

export default function TenantDetailPage() {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
  Promise.all([
    api.get(`${ENDPOINTS.ADMIN_TENANTS}/${tenantId}`),
    api.get(ENDPOINTS.SUBSCRIPTION_PLANS),   // ← اصلاح‌شده
  ])
    .then(([tenantRes, plansRes]) => {
      setTenant(tenantRes.data);
      setPlans(plansRes.data);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
}, [tenantId]);

  const handleActivate = async () => {
    setActivating(true);
    try {
      await api.post(`${ENDPOINTS.ADMIN_TENANTS}/${tenantId}/activate`, {
        planId: selectedPlan,
        durationMonths: duration,
      });
      alert('اشتراک با موفقیت فعال شد');
      navigate('/admin/tenants');
    } catch (err) {
      alert('خطا در فعال‌سازی');
    } finally {
      setActivating(false);
    }
  };

  const handleToggleStatus = async () => {
    setToggling(true);
    try {
      await api.patch(`${ENDPOINTS.ADMIN_TENANTS}/${tenantId}/toggle-status`);
      const res = await api.get(`${ENDPOINTS.ADMIN_TENANTS}/${tenantId}`);
      setTenant(res.data);
    } catch (err) {
      alert('خطا در تغییر وضعیت');
    } finally {
      setToggling(false);
    }
  };

  if (loading) return <AdminLayout><p className="text-center py-10">در حال بارگذاری...</p></AdminLayout>;
  if (!tenant) return <AdminLayout><p className="text-center py-10">پیمانکار یافت نشد</p></AdminLayout>;

  return (
    <AdminLayout>
      <button onClick={() => navigate(-1)} className="btn btn-sm btn-g mb-4">← بازگشت</button>
      <div className="card max-w-2xl">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-black">{tenant.companyName}</h2>
          <button
            className={`btn btn-sm ${tenant.isActive ? 'btn-d' : 'btn-m'}`}
            onClick={handleToggleStatus}
            disabled={toggling}
          >
            {tenant.isActive ? 'غیرفعال‌سازی' : 'فعال‌سازی'}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <p><strong>تلفن:</strong> {tenant.phoneNumber}</p>
          <p><strong>ایمیل:</strong> {tenant.email}</p>
          <p>
            <strong>وضعیت:</strong>{' '}
            <span className={`bdg ${tenant.isActive ? 'bdg-g' : 'bdg-r'}`}>
              {tenant.isActive ? 'فعال' : 'غیرفعال'}
            </span>
          </p>
        </div>

        {tenant.subscription && (
          <div className="mt-4 p-3 bg-[var(--bg2)] rounded-lg">
            <h3 className="font-bold mb-2">اشتراک فعلی</h3>
            <p><strong>پلن:</strong> {tenant.subscription.planId}</p>
            <p><strong>شروع:</strong> {new Date(tenant.subscription.startDate).toLocaleDateString('fa-IR')}</p>
            <p><strong>پایان:</strong> {new Date(tenant.subscription.endDate).toLocaleDateString('fa-IR')}</p>
          </div>
        )}

        <div className="mt-6 space-y-3">
          <h3 className="font-bold text-lg">فعال‌سازی / تمدید اشتراک</h3>
          <div className="fg">
            <label className="fl">پلن</label>
            <select className="fi" value={selectedPlan} onChange={e => setSelectedPlan(e.target.value)}>
              <option value="">-- انتخاب کنید --</option>
              {plans.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} – {p.monthlyPrice?.toLocaleString()} تومان/ماه
                </option>
              ))}
            </select>
          </div>
          <div className="fg">
            <label className="fl">مدت (ماه)</label>
            <input type="number" className="fi" value={duration} onChange={e => setDuration(Number(e.target.value))} min="1" />
          </div>
          <button className="btn btn-p btn-w" onClick={handleActivate} disabled={!selectedPlan || activating}>
            {activating ? 'در حال فعال‌سازی...' : 'فعال‌سازی'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}