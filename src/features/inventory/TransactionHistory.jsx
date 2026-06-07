import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Icon from '../../components/ui/Icon';
import JalaliDatePicker from '../../components/ui/JalaliDatePicker';
import { fromJalali, toJalali } from '../../lib/dateHelpers';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import { useProjects } from '../../contexts/ProjectContext';
import { useWarehouses } from '../../contexts/WarehouseContext';
import { useTransfers } from '../../contexts/TransfersContext';
import { useWork } from '../../contexts/WorkContext';
import { useAuth } from '../../contexts/AuthContext';

export default function TransactionHistory() {
  const { whId } = useParams(); // optional warehouse filter
  const navigate = useNavigate();

  const { projects = [] } = useProjects();
  const { warehouses = [] } = useWarehouses();
  const transfersCtx = useTransfers();
  const pendingTransfers = transfersCtx?.pendingTransfers || [];
  const { installEntries = [], dismantleEntries = [], deliveryEntries = [] } = useWork();
  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // فیلترها
  const [filterType, setFilterType] = useState('all');
  const [filterProject, setFilterProject] = useState('');
  const [filterWarehouse, setFilterWarehouse] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // واکشی تراکنش‌ها از API
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const params = {};
        if (filterType !== 'all') params.type = filterType;
        if (filterProject) params.projectId = filterProject;
        if (filterWarehouse) params.warehouseId = filterWarehouse;
        else if (whId) params.warehouseId = whId;   // if whId is provided, filter by that warehouse
        if (dateFrom) params.from = fromJalali(dateFrom);
        if (dateTo) params.to = fromJalali(dateTo);

        const res = await api.get(ENDPOINTS.REPORTS_TRANSACTIONS, { params });
        setTransactions(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.warn('Failed to fetch transactions', err);
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [filterType, filterProject, filterWarehouse, dateFrom, dateTo, whId]);

  // ترکیب تمام رویدادها: تراکنش‌های API + pending transfers + work entries
  const allEvents = useMemo(() => {
    const events = [];

    // ۱. تراکنش‌های API
    if (Array.isArray(transactions)) {
      transactions.forEach(t => {
        events.push({
          id: t.id,
          type: t.type?.includes('فروش') ? 'sale' :
                t.type?.includes('ضایعات') ? 'scrap' : 'transfer',
          rawType: t.type,
          equipmentName: t.equipmentName,
          quantityChange: t.quantityChange,
          warehouseId: t.warehouseId,
          warehouseName: warehouses.find(w => w.id === t.warehouseId)?.name || '',
          projectId: t.projectId,
          projectName: projects.find(p => p.id === t.projectId)?.employerName || '',
          userId: t.userId,
          userName: t.userName,
          date: t.date,
          description: t.description,
          price: t.price,
        });
      });
    }

    // ۲. نصب‌ها
    (installEntries || []).forEach(e => {
      events.push({
        id: `inst-${e.id}`,
        type: 'install',
        serviceTypeName: e.serviceTypeName || e.serviceType,
        locationTitle: e.locationTitle,
        volume: e.volume,
        projectId: e.projectId,
        date: e.date,
        description: `نصب ${e.serviceTypeName || e.serviceType} - ${e.locationTitle || ''} (${(e.volume || 0).toFixed(1)} m³)`,
      });
    });

    // ۳. بازکردن‌ها
    (dismantleEntries || []).forEach(e => {
      events.push({
        id: `dis-${e.id}`,
        type: 'dismantle',
        serviceTypeName: e.serviceTypeName || e.serviceType,
        locationTitle: e.locationTitle,
        volume: e.volume,
        projectId: e.projectId,
        date: e.date,
        description: `بازکردن ${e.serviceTypeName || e.serviceType} - ${e.locationTitle || ''} (${(e.volume || 0).toFixed(1)} m³)`,
      });
    });

    // ۴. تحویل‌ها
    (deliveryEntries || []).forEach(e => {
      events.push({
        id: `del-${e.id}`,
        type: 'delivery',
        serviceTypeName: e.serviceTypeName || e.serviceType,
        locationTitle: e.locationTitle,
        projectId: e.projectId,
        date: e.date,
        description: `تحویل ${e.serviceTypeName || e.serviceType} - ${e.locationTitle || ''}`,
      });
    });

    // ۵. انتقال‌های در حال انتظار
    if (Array.isArray(pendingTransfers)) {
      pendingTransfers.forEach(transfer => {
        if (transfer?.items && Array.isArray(transfer.items)) {
          transfer.items.forEach(item => {
            events.push({
              id: `pend-${transfer.id}-${item.name || item.equipmentName}`,
              type: 'pending',
              equipmentName: item.name || item.equipmentName,
              quantityChange: item.quantity,
              warehouseId: transfer.warehouseId,
              warehouseName: warehouses.find(w => w.id === transfer.warehouseId)?.name || 'نامشخص',
              projectId: transfer.projectId,
              projectName: projects.find(p => p.id === transfer.projectId)?.employerName || 'نامشخص',
              date: transfer.date,
              description: `در حال انتقال: ${item.quantity} ${item.name || item.equipmentName}`,
            });
          });
        }
      });
    }

    // مرتب‌سازی نزولی بر اساس تاریخ
    events.sort((a, b) => new Date(b.date) - new Date(a.date));
    return events;
  }, [transactions, installEntries, dismantleEntries, deliveryEntries, pendingTransfers, warehouses, projects]);

  // اعمال فیلترهای محلی (نوع، پروژه، انبار، تاریخ) – فیلترهای اصلی توسط API انجام شده، اما فیلتر نوع و whId هم اینجا چک می‌شود
  const filteredEvents = useMemo(() => {
    let filtered = [...allEvents];

    if (filterType !== 'all') {
      filtered = filtered.filter(e => e.type === filterType);
    }

    if (filterProject) {
      filtered = filtered.filter(e => e.projectId === filterProject);
    }

    if (filterWarehouse) {
      filtered = filtered.filter(e => e.warehouseId === filterWarehouse);
    } else if (whId) {
      filtered = filtered.filter(e => e.warehouseId === whId);
    }

    if (dateFrom) {
      const from = new Date(dateFrom);
      filtered = filtered.filter(e => new Date(e.date) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter(e => new Date(e.date) <= to);
    }

    return filtered;
  }, [allEvents, filterType, filterProject, filterWarehouse, dateFrom, dateTo, whId]);

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
            {!whId && (
              <div className="fg">
                <label className="fl">انبار</label>
                <select className="fi text-sm" value={filterWarehouse} onChange={e => setFilterWarehouse(e.target.value)}>
                  <option value="">همه</option>
                  {warehouseOptions.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
                </select>
              </div>
            )}
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
            <JalaliDatePicker label="از تاریخ" value={dateFrom} onChange={setDateFrom} />
            <JalaliDatePicker label="تا تاریخ" value={dateTo} onChange={setDateTo} />
          </div>
        </div>

        {/* لیست رویدادها */}
        {isLoading ? (
          <div className="empty"><div className="empty-icon">⏳</div><h3 className="empty-title">در حال بارگذاری...</h3></div>
        ) : filteredEvents.length === 0 ? (
          <div className="empty"><div className="empty-icon">🕒</div><h3 className="empty-title">تراکنشی یافت نشد</h3></div>
        ) : (
          <div className="space-y-2">
            {filteredEvents.map(event => (
              <div key={event.id} className="card flex items-start justify-between text-xs">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`bdg ${
                      event.type === 'install' ? 'bdg-o' :
                      event.type === 'dismantle' ? 'bdg-r' :
                      event.type === 'delivery' ? 'bdg-b' :
                      event.type === 'sale' ? 'bdg-g' :
                      event.type === 'scrap' ? 'bdg-a' :
                      event.type === 'pending' ? 'bdg-n' : 'bdg-n'
                    }`}>
                      {event.type === 'install' ? 'نصب' :
                       event.type === 'dismantle' ? 'بازکردن' :
                       event.type === 'delivery' ? 'تحویل' :
                       event.type === 'sale' ? 'فروش' :
                       event.type === 'scrap' ? 'ضایعات' :
                       event.type === 'pending' ? 'در حال انتقال' :
                       event.rawType || event.type}
                    </span>
                    {event.warehouseName && <span className="text-[var(--t3)]">{event.warehouseName}</span>}
                    {event.projectName && <span className="text-[var(--t3)]">| {event.projectName}</span>}
                  </div>
                  <p>{event.description}</p>
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