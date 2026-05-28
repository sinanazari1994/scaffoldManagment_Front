import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';

const PAGE_SIZE = 10;

export default function TenantListPage() {
  const [tenants, setTenants] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTenants = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await api.get(ENDPOINTS.ADMIN_TENANTS, {
        params: { search, page: pageNum, pageSize: PAGE_SIZE }
      });
      setTenants(res.data.items || res.data);
      setTotal(res.data.total || res.data.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTenants(page); }, [page, search]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-black mb-6">لیست پیمانکاران</h1>
      <div className="mb-4">
        <input
          className="fi max-w-md"
          placeholder="جستجوی نام شرکت..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {loading ? (
        <p className="text-center py-10">در حال بارگذاری...</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-[var(--bg2)]">
                  <th className="p-3 text-right">نام شرکت</th>
                  <th className="p-3 text-right">شماره تماس</th>
                  <th className="p-3 text-right">ایمیل</th>
                  <th className="p-3 text-right">وضعیت</th>
                  <th className="p-3 text-right">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map(tenant => (
                  <tr key={tenant.id} className="border-b hover:bg-[var(--bg2)]">
                    <td className="p-3">{tenant.companyName}</td>
                    <td className="p-3">{tenant.phoneNumber}</td>
                    <td className="p-3">{tenant.email}</td>
                    <td className="p-3">
                      <span className={`bdg ${tenant.isActive ? 'bdg-g' : 'bdg-r'}`}>
                        {tenant.isActive ? 'فعال' : 'غیرفعال'}
                      </span>
                    </td>
                    <td className="p-3">
                      <Link to={`/admin/tenants/${tenant.id}`} className="btn btn-xs btn-s">جزئیات</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`btn btn-xs ${p === page ? 'btn-p' : 'btn-s'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}