import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES } from '../../lib/constants';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('نام کاربری و رمز عبور را وارد کنید');
      return;
    }
    setLoading(true);
    const result = await login(username.trim(), password.trim());
    setLoading(false);

    if (result.success) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      // ۱. هدایت با بارگذاری کامل (Hard Reload)
      if (storedUser.role === ROLES.WORKER) {
        window.location.href = '/worker/dashboard';
      } else if (storedUser.role === ROLES.SUPER_ADMIN || storedUser.role === ROLES.SUPPORT_AGENT) {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/manager/dashboard';
      }
      // ۲. (دیگر به navigate نیازی نیست)
      return;
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-logo-mark">C</div>
      <h1 className="text-2xl font-black mb-1">مدیریت داربست</h1>
      <p className="text-sm text-[var(--t3)] mb-6">ورود به حساب کاربری</p>
      <div className="card w-full max-w-[360px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="fg">
            <label className="fl">نام کاربری</label>
            <input className="fi" value={username} onChange={e => setUsername(e.target.value)} placeholder="نام کاربری" autoComplete="username" />
          </div>
          <div className="fg">
            <label className="fl">رمز عبور</label>
            <input type="password" className="fi" value={password} onChange={e => setPassword(e.target.value)} placeholder="رمز عبور" autoComplete="current-password" />
          </div>
          {error && (
            <div className="bg-[var(--red-g)] border border-[var(--red-b)] text-[var(--red)] p-3 rounded-lg text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}
          <button type="submit" className="btn btn-p btn-w" disabled={loading}>
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>
      </div>
      <div className="mt-6 text-center">
        <Link to="/register" className="btn btn-s btn-w text-sm">ایجاد حساب کاربری جدید</Link>
      </div>
    </div>
  );
}