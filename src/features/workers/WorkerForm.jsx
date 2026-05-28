import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Icon from '../../components/ui/Icon';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import { ROLES } from '../../lib/constants';

export default function WorkerForm() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLES.WORKER);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !username.trim() || !password.trim()) {
      setError('فیلدهای نام، نام کاربری و رمز عبور الزامی هستند');
      return;
    }

    setLoading(true);
    try {
      // ارسال درخواست ایجاد کاربر (بسته به نقش: Worker یا OfficeManager)
      await api.post(ENDPOINTS.USERS, {
        fullName: fullName.trim(),
        phoneNumber: phone.trim(),
        username: username.trim(),
        password,
        role,
      });

      navigate('/manager/workers');
    } catch (err) {
     const message = err.response?.data?.message || '';
if (message.startsWith('PLAN_LIMIT_REACHED')) {
  const reason = message.split(':')[1] || 'users';
  window.location.href = `/plan-limit?reason=${reason}`;
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
            <label className="fl">شماره موبایل</label>
            <input
              className="fi"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="۰۹۱۲xxxxxxx"
            />
          </div>

          <div className="fg">
            <label className="fl">نام کاربری *</label>
            <input
              className="fi"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="برای ورود"
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