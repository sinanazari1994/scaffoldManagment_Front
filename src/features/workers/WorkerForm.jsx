import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Icon from '../../components/ui/Icon';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import { ROLES } from '../../lib/constants';
import { useData } from '../../contexts/DataContext';

export default function WorkerForm() {
  const navigate = useNavigate();
  const { fetchWorkers } = useData();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLES.WORKER);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !phone.trim() || !password.trim()) {
      setError('فیلدهای نام، شماره موبایل و رمز عبور الزامی هستند');
      return;
    }

    setLoading(true);
    try {
      await api.post(ENDPOINTS.USERS, {
        fullName: fullName.trim(),
        phoneNumber: phone.trim(),        // شماره موبایل به‌عنوان شماره تماس
        username: phone.trim(),           // شماره موبایل به‌عنوان نام کاربری
        password,
        role,
      });

      await fetchWorkers();
      navigate('/manager/workers');
    } catch (err) {
      const message = err.response?.data?.message || '';
      if (message.startsWith('PLAN_LIMIT_REACHED')) {
        window.location.href = `/plan-limit?reason=${message.split(':')[1] || 'users'}`;
        return;
      }
      setError(message || 'خطا در ثبت کاربر. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="کاربر جدید" onBack={() => navigate(-1)}>
      <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto space-y-4">
        <div className="card space-y-4">
          <h3 className="font-bold text-lg">اطلاعات کاربر</h3>

          <div className="fg">
            <label className="fl">نام کامل *</label>
            <input
              className="fi"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="نام و نام خانوادگی"
              required
            />
          </div>

          <div className="fg">
            <label className="fl">شماره موبایل *</label>
            <input
              className="fi"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="۰۹۱۲xxxxxxx"
              required
            />
          </div>

          <div className="fg">
            <label className="fl">رمز عبور *</label>
            <input
              type="password"
              className="fi"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="حداقل ۶ رقم"
              required
            />
          </div>

          <div className="fg">
            <label className="fl">سمت</label>
            <select className="fi" value={role} onChange={e => setRole(e.target.value)}>
              <option value={ROLES.WORKER}>👷 کارگر اجرایی</option>
              <option value={ROLES.OFFICE_MANAGER}>📋 مدیر دفتری</option>
            </select>
          </div>

          {error && (
            <div className="bg-[var(--red-g)] border border-[var(--red-b)] text-[var(--red)] p-3 rounded-lg text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <button type="submit" className="btn btn-p btn-w" disabled={loading}>
            {loading ? 'در حال ثبت...' : 'ثبت کاربر'}
          </button>
        </div>
      </form>
    </AppLayout>
  );
}