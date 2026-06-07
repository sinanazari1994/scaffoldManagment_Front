import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';

export default function RegisterPage() {
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [adminFullName, setAdminFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!companyName.trim() || !phoneNumber.trim() || !adminFullName.trim() || !password.trim()) {
      setError('همهٔ فیلدها الزامی هستند');
      return;
    }

    setLoading(true);
    try {
      await api.post(ENDPOINTS.AUTH.REGISTER, {
  companyName: companyName.trim(),
  phoneNumber: phoneNumber.trim(),
  adminFullName: adminFullName.trim(),
  adminUsername: phoneNumber.trim(),
  adminPassword: password,
});
      setSuccess('ثبت‌نام با موفقیت انجام شد. اکنون می‌توانید وارد شوید.');
      // پاک‌سازی فرم
      setCompanyName('');
      setPhoneNumber('');
      setAdminFullName('');
      setPassword('');
      // بعد از ۲ ثانیه به صفحه ورود برو
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="ثبت‌نام پیمانکار جدید" onBack={() => navigate('/login')}>
      <div className="p-4 max-w-md mx-auto space-y-4">
        <div className="card">
          <h2 className="text-xl font-black mb-4">ایجاد حساب کاربری</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="fg">
              <label className="fl">نام شرکت *</label>
              <input className="fi" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="نام شرکت داربست" required />
            </div>
            <div className="fg">
              <label className="fl">شماره موبایل *</label>
              <input className="fi" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="۰۹۱۲xxxxxxx" required />
            </div>
            <div className="fg">
              <label className="fl">نام مدیر *</label>
              <input className="fi" value={adminFullName} onChange={e => setAdminFullName(e.target.value)} placeholder="نام و نام خانوادگی" required />
            </div>
            <div className="fg">
              <label className="fl">رمز عبور *</label>
              <input type="password" className="fi" value={password} onChange={e => setPassword(e.target.value)} placeholder="حداقل ۶ رقم" required />
            </div>

            {error && (
              <div className="bg-[var(--red-g)] border border-[var(--red-b)] text-[var(--red)] p-3 rounded-lg text-sm flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}
            {success && (
              <div className="bg-[var(--green-g)] border border-[var(--green-b)] text-[var(--green)] p-3 rounded-lg text-sm flex items-center gap-2">
                <span>✅</span> {success}
              </div>
            )}

            <button type="submit" className="btn btn-p btn-w" disabled={loading}>
              {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
            </button>
          </form>
        </div>

        <div className="text-center text-sm text-[var(--t3)]">
          قبلاً ثبت‌نام کرده‌اید؟{' '}
          <Link to="/login" className="text-[var(--ora)] font-bold hover:underline">ورود</Link>
        </div>
      </div>
    </AppLayout>
  );
}