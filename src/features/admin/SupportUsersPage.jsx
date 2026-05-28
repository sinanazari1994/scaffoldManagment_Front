import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';

export default function SupportUsersPage() {
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFullName, setNewFullName] = useState('');

  const fetchUsers = async () => {
    const res = await api.get(ENDPOINTS.ADMIN_SUPPORT_USERS);
    setUsers(res.data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async () => {
    if (!newUsername || !newPassword) return;
    await api.post(ENDPOINTS.ADMIN_SUPPORT_USERS, {
      username: newUsername,
      password: newPassword,
      fullName: newFullName || newUsername,
    });
    setNewUsername('');
    setNewPassword('');
    setNewFullName('');
    fetchUsers();
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-black mb-6">مدیریت کاربران پشتیبانی</h1>
      <div className="card max-w-lg mb-6">
        <h3 className="font-bold mb-3">افزودن کاربر جدید</h3>
        <div className="flex gap-2 items-end">
          <div className="fg flex-1">
            <label className="fl">نام کامل</label>
            <input className="fi" value={newFullName} onChange={e => setNewFullName(e.target.value)} placeholder="اختیاری" />
          </div>
          <div className="fg flex-1">
            <label className="fl">نام کاربری</label>
            <input className="fi" value={newUsername} onChange={e => setNewUsername(e.target.value)} />
          </div>
          <div className="fg flex-1">
            <label className="fl">رمز عبور</label>
            <input type="password" className="fi" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          </div>
          <button className="btn btn-p h-[54px] px-4" onClick={handleCreate}>افزودن</button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-[var(--bg2)]">
              <th className="p-3 text-right">نام کاربری</th>
              <th className="p-3 text-right">نام کامل</th>
              <th className="p-3 text-right">نقش</th>
              <th className="p-3 text-right">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b hover:bg-[var(--bg2)]">
                <td className="p-3">{u.userName}</td>
                <td className="p-3">{u.fullName}</td>
                <td className="p-3">
                  <span className="bdg bdg-n">{u.roles?.join(', ') || 'SupportAgent'}</span>
                </td>
                <td className="p-3">
                  <button
                    className="btn btn-xs btn-d"
                    onClick={async () => {
                      if (confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
                        await api.delete(`${ENDPOINTS.ADMIN_SUPPORT_USERS}/${u.id}`);
                        fetchUsers();
                      }
                    }}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}