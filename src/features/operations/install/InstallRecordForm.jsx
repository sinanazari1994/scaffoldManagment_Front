import { useState, useMemo, useEffect, useCallback } from 'react';
import LocationAutocomplete from '../../../components/ui/LocationAutocomplete';
import Icon from '../../../components/ui/Icon';
import Sheet from '../../../components/ui/Sheet';
import api from '../../../services/api';
import { ENDPOINTS } from '../../../services/endpoints';
import { useWork } from '../../../contexts/WorkContext';
import { useLocations } from '../../../contexts/LocationContext';
import { useServices } from '../../../contexts/ServiceContext';
import { useData } from '../../../contexts/DataContext';
import { ROLES } from '../../../lib/constants';
import InstallHistory from './InstallHistory';

const PAGE_SIZE = 10;

export default function InstallRecordForm({ projectId }) {
  const { addInstallEntry } = useWork();                // فقط ثبت
  const { addLocation, fetchAvailableLocations } = useLocations();
  const { services = [], addService, fetchServices } = useServices();
  const { workers = [] } = useData();

  // stateهای فرم
  const [serviceTypeId, setServiceTypeId] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [locationTitle, setLocationTitle] = useState('');
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);

  // stateهای مودال سرویس جدید
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');

  // stateهای تاریخچه (صفحه‌بندی)
  const [installs, setInstalls] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // state برای آکاردئون
  const [expandedId, setExpandedId] = useState(null);

  const availableWorkers = useMemo(() => {
    return (workers || []).filter(w => w.role === ROLES.WORKER);
  }, [workers]);

  // واکشی نصب‌ها با صفحه‌بندی
  const fetchInstalls = useCallback(async (pageNum = 1) => {
    setLoadingMore(true);
    try {
      const res = await api.get(ENDPOINTS.WORK_ENTRY_BY_PROJECT(projectId), {
        params: { type: 'Install', page: pageNum, pageSize: PAGE_SIZE },
      });
      const data = res.data || [];
      if (pageNum === 1) {
        setInstalls(data);
      } else {
        setInstalls(prev => [...prev, ...data]);
      }
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      console.error('Failed to fetch installs', err);
    } finally {
      setLoadingMore(false);
    }
  }, [projectId]);

  // واکشی اولیه
  useEffect(() => {
    fetchInstalls(1);
  }, [fetchInstalls]);

  // واکشی مکان‌های در دسترس
  useEffect(() => {
    if (!serviceTypeId || !services.length) {
      setAvailableLocations([]);
      return;
    }
    const serviceName = services.find(s => s.id === serviceTypeId)?.name || '';
    if (!serviceName) {
      setAvailableLocations([]);
      return;
    }
    fetchAvailableLocations(projectId, serviceName).then(data => {
      setAvailableLocations(
        (data || []).map(loc => ({
          id: loc.id,
          title: loc.title || loc.serviceTypeName || loc.serviceType,
        }))
      );
    });
  }, [serviceTypeId, projectId, services, fetchAvailableLocations]);

  const computedVolume = (() => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    return l * w * h;
  })();

  const toggleWorker = (workerId) => {
    setSelectedWorkers(prev =>
      prev.includes(workerId) ? prev.filter(id => id !== workerId) : [...prev, workerId]
    );
  };

  const handleAddNewService = async () => {
    if (!newServiceName.trim()) return;
    try {
      await addService(newServiceName.trim());
      await fetchServices();
      setShowNewServiceModal(false);
      setNewServiceName('');
    } catch (err) {
      console.error('Failed to add service', err);
    }
  };

  const handleAddRow = async () => {
    if (!serviceTypeId || computedVolume <= 0 || selectedWorkers.length === 0) return;

    const service = services.find(s => s.id === serviceTypeId);
    const serviceTypeName = service?.name || '';

    let finalLocationId = null;
    if (locationTitle.trim()) {
      const existing = availableLocations.find(loc => loc.title === locationTitle.trim());
      if (existing) {
        finalLocationId = existing.id;
      } else {
        finalLocationId = await addLocation(projectId, serviceTypeName, locationTitle.trim());
        setAvailableLocations(prev => [...prev, { id: finalLocationId, title: locationTitle.trim() }]);
      }
    }

    await addInstallEntry({
      projectId,
      serviceTypeName,
      locationTitle: locationTitle.trim(),
      locationId: finalLocationId,
      length: parseFloat(length),
      width: parseFloat(width),
      height: parseFloat(height),
      volume: computedVolume,
      workerIds: selectedWorkers,
      date: new Date().toISOString(),
    });

    // رفرش لیست از ابتدا
    await fetchInstalls(1);
    setPage(1);

    setLength('');
    setWidth('');
    setHeight('');
    setLocationTitle('');
    setSelectedWorkers([]);
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchInstalls(nextPage);
    }
  };

  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        {/* انتخاب سرویس */}
        <div className="fg">
          <label className="fl">نوع عملیات</label>
          <select
            className="fi"
            value={serviceTypeId}
            onChange={e => {
              if (e.target.value === '__new__') {
                setShowNewServiceModal(true);
                return;
              }
              setServiceTypeId(e.target.value);
            }}
          >
            <option key="empty" value="">-- انتخاب کنید --</option>
            {(services || []).map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
            <option key="__new__" value="__new__" style={{ color: 'var(--ora)', fontWeight: 'bold' }}>
              + افزودن نوع جدید
            </option>
          </select>
        </div>

        {/* ابعاد */}
        <div className="g3">
          <div className="fg">
            <label className="fl">طول (متر)</label>
            <input type="number" className="fi" value={length} onChange={e => setLength(e.target.value)} min="0" step="0.01" />
          </div>
          <div className="fg">
            <label className="fl">عرض (متر)</label>
            <input type="number" className="fi" value={width} onChange={e => setWidth(e.target.value)} min="0" step="0.01" />
          </div>
          <div className="fg">
            <label className="fl">ارتفاع (متر)</label>
            <input type="number" className="fi" value={height} onChange={e => setHeight(e.target.value)} min="0" step="0.01" />
          </div>
        </div>

        {computedVolume > 0 && (
          <div className="text-sm bg-[var(--steel-g)] text-[var(--steel)] rounded-xl p-2 text-center">
            حجم: <strong>{computedVolume.toFixed(2)}</strong> مترمکعب
          </div>
        )}

        <LocationAutocomplete
          value={locationTitle}
          onChange={setLocationTitle}
          suggestions={availableLocations}
        />

        <div>
          <label className="fl">👷 کارگران</label>
          <div className="grid grid-cols-2 gap-2">
            {(availableWorkers || []).map(w => (
              <button
                key={w.id}
                type="button"
                onClick={() => toggleWorker(w.id)}
                className={`chip ${selectedWorkers.includes(w.id) ? 'on' : ''}`}
              >
                {selectedWorkers.includes(w.id) ? '✅ ' : ''}{w.fullName}
              </button>
            ))}
          </div>
        </div>

        <button
          className="btn btn-p btn-w"
          disabled={!serviceTypeId || computedVolume <= 0 || selectedWorkers.length === 0}
          onClick={handleAddRow}
        >
          <Icon name="plus" size={18} /> افزودن
        </button>
      </div>

      {/* تاریخچه نصب‌ها */}
      {installs.length > 0 && (
        <div className="card p-0 overflow-hidden">
          <div className="bg-[var(--bg2)] p-3 text-sm font-bold">
            📋 موارد ثبت‌شده ({installs.length})
          </div>
          <InstallHistory
            installs={installs}
            availableWorkers={availableWorkers}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
          />
          {hasMore && (
            <div className="p-3 text-center">
           <button
  className="btn btn-sm btn-s w-full !justify-center"
  onClick={loadMore}
  disabled={loadingMore}
>
  {loadingMore ? 'در حال بارگذاری...' : 'بارگذاری بیشتر'}
</button>
            </div>
          )}
        </div>
      )}

      {/* مودال افزودن سرویس جدید */}
      <Sheet open={showNewServiceModal} onClose={() => setShowNewServiceModal(false)} title="افزودن خدمت جدید">
        <div className="space-y-4">
          <div className="fg">
            <label className="fl">نام خدمت</label>
            <input
              className="fi"
              value={newServiceName}
              onChange={e => setNewServiceName(e.target.value)}
              placeholder="مثلاً: زیر بتن"
              onKeyDown={e => e.key === 'Enter' && handleAddNewService()}
            />
          </div>
          <button className="btn btn-p btn-w" onClick={handleAddNewService} disabled={!newServiceName.trim()}>
            ذخیره
          </button>
        </div>
      </Sheet>
    </div>
  );
}