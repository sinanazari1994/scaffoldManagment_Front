import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Icon from '../../components/ui/Icon';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import { useProjects } from '../../contexts/ProjectContext';
import { useWarehouses } from '../../contexts/WarehouseContext';
import { useTransfers } from '../../contexts/TransfersContext';
import { toJalali } from '../../lib/dateHelpers';

export default function TransactionHistory() {
  const navigate = useNavigate();
  const { projects = [] } = useProjects();
  const { warehouses = [] } = useWarehouses();
  // دریافت امن pendingTransfers
  const transfersCtx = useTransfers();
  const pendingTransfers = transfersCtx?.pendingTransfers || [];

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // فیلترها
  const [filterType, setFilterType] = useState('all');
  const [filterProject, setFilterProject] = useState('');
  const [filterWarehouse, setFilterWarehouse] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // واکشی تراکنش‌ها از API
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (filterType !== 'all') params.type = filterType;
      if (filterProject) params.projectId = filterProject;
      if (filterWarehouse) params.warehouseId = filterWarehouse;
      if (dateFrom) params.from = dateFrom;
      if (dateTo) params.to = dateTo;

      const res = await api.get(ENDPOINTS.REPORTS_TRANSACTIONS, { params });
      const data = res.data;
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Failed to fetch transactions', err);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filterType, filterProject, filterWarehouse, dateFrom, dateTo]);

  // ترکیب تراکنش‌های API با pending transfers (با ایمنی کامل)
  const allEvents = useMemo(() => {
    const events = Array.isArray(transactions) ? [...transactions] : [];

    // اضافه کردن pending transfers
    if (Array.isArray(pendingTransfers)) {
      pendingTransfers.forEach((transfer) => {
        if (transfer?.items && Array.isArray(transfer.items)) {
          transfer.items.forEach((item) => {
            events.push({
              id: `pending-${transfer.id}-${item.name || item.equipmentName}`,
              type: 'pending',
              equipmentName: item.name || item.equipmentName,
              quantityChange: item.quantity,
              date: transfer.date,
              warehouseName: warehouses.find(w => w.id === transfer.warehouseId)?.name || 'نامشخص',
              projectName: projects.find(p => p.id === transfer.projectId)?.employerName || 'نامشخص',
              description: `در حال انتقال: ${item.quantity} ${item.name || item.equipmentName}`,
            });
          });
        }
      });
    }

    // مرتب‌سازی نزولی بر اساس تاریخ
    events.sort((a, b) => new Date(b.date) - new Date(a.date));
    return events;
  }, [transactions, pendingTransfers, warehouses, projects]);

  const projectOptions = projects.map(p => ({ value: p.id, label: p.employerName }));
  const warehouseOptions = warehouses.map(w => ({ value: w.id, label: w.name }));

  return (
    <AppLayout title="تاریخچه" onBack={() => navigate(-1)}>
      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* فیلترها */}
        <div className="card space-y-3">
          <h3 className="font-bold text-sm">فیلترها</h3>
          <div className="g2">
            <div className="fg">
              <label className="fl">نوع</label>
              <select className="fi text-sm" value={filterType} onChange={e => setFilterType(e.target.value)}>
                <option value="all">همه</option>
                <option value="transfer">انتقال</option>
                <option value="install">نصب</option>
                <option value="dismantle">بازکردن</option>
                <option value="delivery">تحویل</option>
                <option value="sale">فروش</option>
                <option value="scrap">ضایعات</option>
                <option value="pending">در حال انتقال</option>
              </select>
            </div>
            <div className="fg">
              <label className="fl">انبار</label>
              <select className="fi text-sm" value={filterWarehouse} onChange={e => setFilterWarehouse(e.target.value)}>
                <option value="">همه</option>
                {warehouseOptions.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
              </select>
            </div>
          </div>
          <div className="g2">
            <div className="fg">
              <label className="fl">پروژه</label>
              <select className="fi text-sm" value={filterProject} onChange={e => setFilterProject(e.target.value)}>
                <option value="">همه</option>
                {projectOptions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>
          <div className="g2">
            <div className="fg">
              <label className="fl">از تاریخ</label>
              <input type="date" className="fi text-sm" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            </div>
            <div className="fg">
              <label className="fl">تا تاریخ</label>
              <input type="date" className="fi text-sm" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            </div>
          </div>
        </div>

        {/* لیست تراکنش‌ها */}
        {isLoading ? (
          <div className="empty">
            <div className="empty-icon">⏳</div>
            <h3 className="empty-title">در حال بارگذاری...</h3>
          </div>
        ) : allEvents.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🕒</div>
            <h3 className="empty-title">تراکنشی یافت نشد</h3>
          </div>
        ) : (
          <div className="space-y-2">
            {allEvents.map(event => (
              <div key={event.id} className="card flex items-start justify-between text-xs">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`bdg ${
                      event.type?.includes('نصب') || event.type?.includes('install') ? 'bdg-o' :
                      event.type?.includes('بازکردن') || event.type?.includes('dismantle') ? 'bdg-r' :
                      event.type?.includes('تحویل') || event.type?.includes('delivery') ? 'bdg-b' :
                      event.type?.includes('فروش') || event.type?.includes('sale') ? 'bdg-g' :
                      event.type?.includes('ضایعات') || event.type?.includes('scrap') ? 'bdg-a' :
                      event.type?.includes('pending') || event.type?.includes('در حال انتقال') ? 'bdg-n' :
                      'bdg-n'
                    }`}>
                      {event.type}
                    </span>
                    {event.warehouseName && <span className="text-[var(--t3)]">{event.warehouseName}</span>}
                    {event.projectName && <span className="text-[var(--t3)]">| {event.projectName}</span>}
                  </div>
                  <p>
                    {event.equipmentName && `${event.equipmentName} `}
                    {event.quantityChange && `(${event.quantityChange > 0 ? '+' : ''}${event.quantityChange}) `}
                    {event.description}
                  </p>
                  {event.price && <p className="text-[var(--green)] font-bold mt-1">{event.price.toLocaleString()} تومان</p>}
                </div>
                <div className="text-left ml-3 whitespace-nowrap">
                  <p className="text-[var(--t3)]">{toJalali(new Date(event.date))}</p>
                  {event.userName && <p className="text-[var(--t3)]">{event.userName}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}