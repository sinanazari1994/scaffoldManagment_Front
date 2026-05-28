import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Icon from '../../components/ui/Icon';
import Sheet from '../../components/ui/Sheet';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState([]);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const res = await api.get(ENDPOINTS.ADMIN_RECEIPTS, {
        params: { status: statusFilter },
      });
      setReceipts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReceipts(); }, [statusFilter]);

  const handleAction = async (id, action) => {
    try {
      await api.patch(`${ENDPOINTS.ADMIN_RECEIPTS}/${id}/${action}`);
      fetchReceipts();
    } catch (err) {
      alert('خطا در عملیات');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('آیا از حذف این فیش اطمینان دارید؟')) return;
    try {
      await api.delete(`${ENDPOINTS.ADMIN_RECEIPTS}/${id}`);
      fetchReceipts();
    } catch (err) {
      alert('خطا در حذف فیش');
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-black mb-6">فیش‌های واریزی</h1>

      {/* فیلتر وضعیت */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm font-bold">وضعیت:</span>
        <select
          className="fi max-w-xs"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="Pending">در انتظار</option>
          <option value="Approved">تأییدشده</option>
          <option value="Rejected">ردشده</option>
        </select>
      </div>

      {/* جدول */}
      {loading ? (
        <div className="text-center py-10">در حال بارگذاری...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-[var(--bg2)]">
                <th className="p-3 text-right">مبلغ (تومان)</th>
                <th className="p-3 text-right">تاریخ</th>
                <th className="p-3 text-right">وضعیت</th>
                <th className="p-3 text-right">عکس فیش</th>
                <th className="p-3 text-right">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map(r => (
                <tr key={r.id} className="border-b hover:bg-[var(--bg2)]">
                  <td className="p-3 text-right">{r.amount?.toLocaleString()}</td>
                  <td className="p-3 text-right">
                    {new Date(r.date).toLocaleDateString('fa-IR')}
                  </td>
                  <td className="p-3 text-right">
                    <span
                      className={`bdg ${
                        r.status === 'Approved'
                          ? 'bdg-g'
                          : r.status === 'Rejected'
                          ? 'bdg-r'
                          : 'bdg-o'
                      }`}
                    >
                      {r.status === 'Approved'
                        ? 'تأییدشده'
                        : r.status === 'Rejected'
                        ? 'ردشده'
                        : 'در انتظار'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {r.imageUrl ? (
                      <button
                        className="btn btn-xs btn-s"   // ← دکمهٔ ثانویه (قابل مشاهده)
                        onClick={() => setSelectedImage(r.imageUrl)}
                        title="مشاهده فیش"
                      >
                        <Icon name="eye" size={14} />
                        <span className="mr-1">مشاهده</span>
                      </button>
                    ) : (
                      <span className="text-[var(--t4)]">–</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex gap-1 justify-end">
                      {r.status === 'Pending' && (
                        <>
                          <button
                            className="btn btn-xs btn-m"
                            onClick={() => handleAction(r.id, 'approve')}
                            title="تأیید فیش"
                          >
                            تأیید
                          </button>
                          <button
                            className="btn btn-xs btn-d"
                            onClick={() => handleAction(r.id, 'reject')}
                            title="رد فیش"
                          >
                            رد
                          </button>
                        </>
                      )}
                      {/* دکمهٔ حذف برای همهٔ فیش‌ها */}
                      <button
                        className="btn btn-xs btn-g text-[var(--red)]"
                        onClick={() => handleDelete(r.id)}
                        title="حذف فیش"
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* مودال نمایش تصویر */}
      <Sheet open={!!selectedImage} onClose={() => setSelectedImage(null)} title="فیش واریزی">
        <div className="flex justify-center">
          <img
            src={selectedImage}
            alt="فیش واریزی"
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>
      </Sheet>
    </AdminLayout>
  );
}