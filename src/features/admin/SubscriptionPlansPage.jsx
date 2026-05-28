import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editPlan, setEditPlan] = useState(null);

  // فیلدهای فرم
  const [name, setName] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState('');
  const [yearlyPrice, setYearlyPrice] = useState('');
  const [maxProjects, setMaxProjects] = useState('');
  const [maxUsers, setMaxUsers] = useState('');
  const [maxWarehouses, setMaxWarehouses] = useState('');
  const [maxTotalEquipment, setMaxTotalEquipment] = useState('');
  const [maxStorageMb, setMaxStorageMb] = useState('');

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await api.get(ENDPOINTS.ADMIN_SUBSCRIPTION_PLANS); // '/admin/subscription-plans'
      setPlans(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlans(); }, []);

  const resetForm = () => {
    setName('');
    setMonthlyPrice('');
    setYearlyPrice('');
    setMaxProjects('');
    setMaxUsers('');
    setMaxWarehouses('');
    setMaxTotalEquipment('');
    setMaxStorageMb('');
    setEditPlan(null);
    setShowForm(false);
  };

  const openEdit = (plan) => {
    setName(plan.name);
    setMonthlyPrice(plan.monthlyPrice.toString());
    setYearlyPrice(plan.yearlyPrice.toString());
    setMaxProjects(plan.maxProjects.toString());
    setMaxUsers(plan.maxUsers.toString());
    setMaxWarehouses(plan.maxWarehouses.toString());
    setMaxTotalEquipment(plan.maxTotalEquipment.toString());
    setMaxStorageMb(plan.maxStorageMb.toString());
    setEditPlan(plan);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name,
      monthlyPrice: parseFloat(monthlyPrice) || 0,
      yearlyPrice: parseFloat(yearlyPrice) || 0,
      maxProjects: parseInt(maxProjects) || 0,
      maxUsers: parseInt(maxUsers) || 0,
      maxWarehouses: parseInt(maxWarehouses) || 0,
      maxTotalEquipment: parseInt(maxTotalEquipment) || 0,
      maxStorageMb: parseInt(maxStorageMb) || 0,
    };

    try {
      if (editPlan) {
        await api.put(`${ENDPOINTS.ADMIN_SUBSCRIPTION_PLANS}/${editPlan.id}`, data);
      } else {
        await api.post(ENDPOINTS.ADMIN_SUBSCRIPTION_PLANS, data);
      }
      resetForm();
      fetchPlans();
    } catch (err) {
      alert('خطا در ذخیره‌سازی');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('آیا از حذف این پلن اطمینان دارید؟')) return;
    try {
      await api.delete(`${ENDPOINTS.ADMIN_SUBSCRIPTION_PLANS}/${id}`);
      fetchPlans();
    } catch (err) {
      alert('خطا در حذف');
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black">پلن‌های اشتراک</h1>
        <button className="btn btn-p" onClick={() => { resetForm(); setShowForm(true); }}>
          + افزودن پلن جدید
        </button>
      </div>

      {/* فرم افزودن/ویرایش */}
      {showForm && (
        <div className="card max-w-2xl mb-6">
          <h3 className="font-bold text-lg mb-4">{editPlan ? 'ویرایش پلن' : 'افزودن پلن جدید'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="fg">
                <label className="fl">نام پلن</label>
                <input className="fi" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="fg">
                <label className="fl">قیمت ماهانه (تومان)</label>
                <input type="number" className="fi" value={monthlyPrice} onChange={e => setMonthlyPrice(e.target.value)} required />
              </div>
              <div className="fg">
                <label className="fl">قیمت سالانه (تومان)</label>
                <input type="number" className="fi" value={yearlyPrice} onChange={e => setYearlyPrice(e.target.value)} />
              </div>
              <div className="fg">
                <label className="fl">حداکثر پروژه</label>
                <input type="number" className="fi" value={maxProjects} onChange={e => setMaxProjects(e.target.value)} required />
              </div>
              <div className="fg">
                <label className="fl">حداکثر کاربران</label>
                <input type="number" className="fi" value={maxUsers} onChange={e => setMaxUsers(e.target.value)} required />
              </div>
              <div className="fg">
                <label className="fl">حداکثر انبارها</label>
                <input type="number" className="fi" value={maxWarehouses} onChange={e => setMaxWarehouses(e.target.value)} />
              </div>
              <div className="fg">
                <label className="fl">حداکثر تجهیزات</label>
                <input type="number" className="fi" value={maxTotalEquipment} onChange={e => setMaxTotalEquipment(e.target.value)} />
              </div>
              <div className="fg">
                <label className="fl">حداکثر ذخیره‌سازی (MB)</label>
                <input type="number" className="fi" value={maxStorageMb} onChange={e => setMaxStorageMb(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn btn-p">{editPlan ? 'ذخیره تغییرات' : 'افزودن'}</button>
              <button type="button" className="btn btn-s" onClick={resetForm}>انصراف</button>
            </div>
          </form>
        </div>
      )}

      {/* جدول پلن‌ها */}
      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-[var(--bg2)]">
                <th className="p-3 text-right">نام پلن</th>
                <th className="p-3 text-right">قیمت ماهانه</th>
                <th className="p-3 text-right">پروژه‌ها</th>
                <th className="p-3 text-right">کاربران</th>
                <th className="p-3 text-right">انبارها</th>
                <th className="p-3 text-right">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {plans.map(p => (
                <tr key={p.id} className="border-b hover:bg-[var(--bg2)]">
                  <td className="p-3 font-bold">{p.name}</td>
                  <td className="p-3">{p.monthlyPrice?.toLocaleString()} تومان</td>
                  <td className="p-3">{p.maxProjects}</td>
                  <td className="p-3">{p.maxUsers}</td>
                  <td className="p-3">{p.maxWarehouses}</td>
                  <td className="p-3 flex gap-2">
                    <button className="btn btn-xs btn-s" onClick={() => openEdit(p)}>ویرایش</button>
                    <button className="btn btn-xs btn-d" onClick={() => handleDelete(p.id)}>حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}