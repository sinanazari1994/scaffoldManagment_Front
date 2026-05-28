import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { useData } from '../../contexts/DataContext';
import Icon from '../../components/ui/Icon';

export default function InventoryView() {
  const { whId } = useParams();
  const { warehouses } = useData();
  const navigate = useNavigate();
  const wh = warehouses.find(w => w.id === whId);
  const [expand, setExpand] = useState(null);
  const [search, setSearch] = useState('');

  if (!wh) return <AppLayout title="یافت نشد" onBack={() => navigate(-1)}><div className="p-4">انبار موجود نیست</div></AppLayout>;

  const filtered = wh.inventory.filter(i => i.equipment.includes(search));

  return (
    <AppLayout title={wh.name} onBack={() => navigate(-1)}>
      <div className="p-4 max-w-md mx-auto space-y-3">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[var(--green-g)] rounded-lg p-2 text-center">
            <p className="font-bold text-[var(--green)]">{wh.inventory.reduce((s,i)=>s+i.quantity,0)}</p>
            <p className="text-xs text-[var(--t3)]">در انبار</p>
          </div>
          <div className="bg-[var(--steel-g)] rounded-lg p-2 text-center"><p className="font-bold text-[var(--steel)]">-</p><p className="text-xs">در پروژه</p></div>
          <div className="bg-[var(--red-g)] rounded-lg p-2 text-center"><p className="font-bold text-[var(--red)]">۰</p><p className="text-xs">آسیب‌دیده</p></div>
        </div>

        {/* Search */}
        <input className="fi" placeholder="جستجو..." value={search} onChange={e => setSearch(e.target.value)} />

        {/* Material List */}
        <div className="card p-0">
          {filtered.map(item => {
            const isOpen = expand === item.equipment;
            return (
              <div key={item.equipment} className="border-b border-[var(--border)] last:border-0">
                <div className="flex items-center gap-3 px-4 py-3 cursor-pointer" onClick={() => setExpand(isOpen ? null : item.equipment)}>
                  <div className="w-9 h-9 rounded-lg bg-[var(--bg2)] flex items-center justify-center text-xl">📦</div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{item.equipment}</p>
                    <p className="text-xs text-[var(--t3)]">تعداد: {item.quantity}</p>
                  </div>
                  <Icon name="chevron" size={16} style={{ transform: isOpen ? 'rotate(180deg)' : '' }} />
                </div>

                {isOpen && (
                  <div className="bg-[var(--bg2)] p-4 space-y-3 text-sm">
                    {/* Progress bars */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs w-16">انبار</span>
                      <div className="flex-1 h-2 bg-gray-300 rounded-full"><div className="h-2 bg-[var(--green)] rounded-full" style={{ width: '100%' }} /></div>
                      <span className="text-xs font-bold">{item.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs w-16">پروژه‌ها</span>
                      <div className="flex-1 h-2 bg-gray-300 rounded-full"><div className="h-2 bg-[var(--steel)] rounded-full" style={{ width: '0%' }} /></div>
                      <span className="text-xs">۰</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="btn btn-sm btn-s" onClick={() => navigate(`/manager/warehouses/${whId}/sale`)}>💰 فروش</button>
                      <button className="btn btn-sm btn-d" onClick={() => navigate(`/manager/warehouses/${whId}/scrap`)}>🗑️ ضایعات</button>
                      <button className="btn btn-sm btn-g" onClick={() => navigate(`/manager/warehouses/${whId}/history`)}>🕒 تاریخچه</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}