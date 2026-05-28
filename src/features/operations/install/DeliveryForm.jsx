import { useState, useMemo, useEffect, useCallback } from 'react';
import LocationAutocomplete from '../../../components/ui/LocationAutocomplete';
import Icon from '../../../components/ui/Icon';
import Sheet from '../../../components/ui/Sheet';
import api from '../../../services/api';
import { ENDPOINTS } from '../../../services/endpoints';
import { useWork } from '../../../contexts/WorkContext';
import { useLocations } from '../../../contexts/LocationContext';
import { useServices } from '../../../contexts/ServiceContext';
import DeliveryHistory from './DeliveryHistory';

const PAGE_SIZE = 10;

export default function DeliveryForm({ projectId }) {
  const { addDeliveryEntry } = useWork();
  const { addLocation, fetchAvailableLocations } = useLocations();
  const { services = [], addService } = useServices();

  // stateهای فرم
  const [deliverServiceTypeId, setDeliverServiceTypeId] = useState('');
  const [deliverLocationTitle, setDeliverLocationTitle] = useState('');
  const [deliverAvailableLocations, setDeliverAvailableLocations] = useState([]);
  const [installedVolume, setInstalledVolume] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().slice(0, 10));

  // stateهای مودال سرویس جدید
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');

  // stateهای مربوط به لیست تحویل‌ها (صفحه‌بندی)
  const [deliveries, setDeliveries] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // state برای حجم‌های نصب‌شدهٔ هر تحویل
  const [deliveryVolumes, setDeliveryVolumes] = useState({});

  // واکشی لیست تحویل‌ها با صفحه‌بندی
  const fetchDeliveries = useCallback(async (pageNum = 1) => {
    setLoadingMore(true);
    try {
      const res = await api.get(ENDPOINTS.WORK_ENTRY_BY_PROJECT(projectId), {
        params: { type: 'Delivery', page: pageNum, pageSize: PAGE_SIZE },
      });
      const data = res.data || [];
      if (pageNum === 1) {
        setDeliveries(data);
      } else {
        setDeliveries(prev => [...prev, ...data]);
      }
      setHasMore(data.length === PAGE_SIZE);
      console.log('Fetched deliveries:', data); // <-- لاگ جدید
    } catch (err) {
      console.error('Failed to fetch deliveries', err);
    } finally {
      setLoadingMore(false);
    }
  }, [projectId]);

  // واکشی اولیه
  useEffect(() => {
    fetchDeliveries(1);
  }, [fetchDeliveries]);

  // دریافت حجم نصب‌شده برای هر تحویل (با تغییر deliveries اجرا می‌شود)
  useEffect(() => {
    if (!deliveries.length) return;
    console.log('Deliveries for volume fetch:', deliveries); // <-- لاگ جدید
    const fetchVolumes = async () => {
      const volumes = {};
      await Promise.all(
        deliveries.map(async (del) => {
          if (!del.locationId) {
            console.warn('No locationId for delivery:', del.id, del); // <-- لاگ جدید
            return;
          }
          if (deliveryVolumes[del.id] !== undefined) return;
          try {
            const serviceName = del.serviceTypeName || '';
            const res = await api.get(ENDPOINTS.WORK_ENTRY_INSTALLED_VOLUME, {
              params: {
                projectId,
                serviceTypeName: serviceName,
                locationId: del.locationId,
              },
            });
            volumes[del.id] = res.data.volume;
          } catch (err) {
            console.error('Failed to get volume for', del.id, err);
            volumes[del.id] = 0;
          }
        })
      );
      if (Object.keys(volumes).length > 0) {
        setDeliveryVolumes(prev => ({ ...prev, ...volumes }));
      }
    };
    fetchVolumes();
  }, [deliveries, projectId]);

  // واکشی مکان‌های در دسترس برای تحویل
  useEffect(() => {
    if (!deliverServiceTypeId || !services.length) {
      setDeliverAvailableLocations([]);
      return;
    }
    const serviceName = services.find(s => s.id === deliverServiceTypeId)?.name || '';
    if (!serviceName) {
      setDeliverAvailableLocations([]);
      return;
    }
    fetchAvailableLocations(projectId, serviceName).then(data => {
      setDeliverAvailableLocations(
        (data || []).map(loc => ({
          id: loc.id,
          title: loc.title || loc.serviceTypeName || loc.serviceType,
        }))
      );
    });
  }, [deliverServiceTypeId, projectId, services, fetchAvailableLocations]);

  // دریافت حجم تجمیعی نصب‌شده برای مکان انتخاب‌شده
  useEffect(() => {
    if (!deliverServiceTypeId || !deliverLocationTitle.trim()) {
      setInstalledVolume(null);
      return;
    }
    const serviceName = services.find(s => s.id === deliverServiceTypeId)?.name || '';
    const selectedLocation = deliverAvailableLocations.find(loc => loc.title === deliverLocationTitle);
    if (!selectedLocation || !serviceName) {
      setInstalledVolume(null);
      return;
    }
    api.get(ENDPOINTS.WORK_ENTRY_INSTALLED_VOLUME, {
      params: { projectId, serviceTypeName: serviceName, locationId: selectedLocation.id },
    })
      .then(res => setInstalledVolume(res.data.volume))
      .catch(() => setInstalledVolume(null));
  }, [deliverServiceTypeId, deliverLocationTitle, deliverAvailableLocations, projectId, services]);

  const handleAddNewService = async () => {
    if (!newServiceName.trim()) return;
    try {
      await addService(newServiceName.trim());
      setShowNewServiceModal(false);
      setNewServiceName('');
    } catch (err) {
      console.error('Failed to add service', err);
    }
  };

  const handleDeliver = async () => {
    if (!deliverServiceTypeId || !deliverLocationTitle.trim()) return;

    const service = services.find(s => s.id === deliverServiceTypeId);
    const serviceTypeName = service?.name || '';

    let finalLocationId = null;
    const existing = deliverAvailableLocations.find(loc => loc.title === deliverLocationTitle.trim());
    if (existing) {
      finalLocationId = existing.id;
    } else {
      finalLocationId = await addLocation(projectId, serviceTypeName, deliverLocationTitle.trim());
    }

    await addDeliveryEntry({
      projectId,
      serviceTypeName,
      locationTitle: deliverLocationTitle.trim(),
      locationId: finalLocationId,
      date: deliveryDate,
    });

    // رفرش لیست از ابتدا
    await fetchDeliveries(1);
    setPage(1);
    setDeliverLocationTitle('');
    setDeliveryDate(new Date().toISOString().slice(0, 10));

    // به‌روزرسانی مکان‌های در دسترس
    if (deliverServiceTypeId) {
      const serviceName = services.find(s => s.id === deliverServiceTypeId)?.name || '';
      if (serviceName) {
        fetchAvailableLocations(projectId, serviceName).then(data => {
          const newLocations = (data || []).map(loc => ({
            id: loc.id,
            title: loc.title || loc.serviceTypeName || loc.serviceType,
          }));
          setDeliverAvailableLocations(newLocations);
        });
      }
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchDeliveries(nextPage);
    }
  };

  return (
    <div className="card space-y-4">
      {/* انتخاب نوع خدمت */}
      <div className="fg">
        <label className="fl">نوع عملیات</label>
        <select
          className="fi"
          value={deliverServiceTypeId}
          onChange={e => {
            if (e.target.value === '__new__') {
              setShowNewServiceModal(true);
              return;
            }
            setDeliverServiceTypeId(e.target.value);
            setDeliverLocationTitle('');
          }}
        >
          <option value="">-- انتخاب کنید --</option>
          {(services || []).map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
          <option value="__new__" style={{ color: 'var(--ora)', fontWeight: 'bold' }}>
            + افزودن نوع جدید
          </option>
        </select>
      </div>

      {/* انتخاب مکان */}
      <LocationAutocomplete
        value={deliverLocationTitle}
        onChange={setDeliverLocationTitle}
        suggestions={deliverAvailableLocations}
        placeholder="انتخاب مکان نصب‌شده"
      />

      {/* حجم نصب‌شده */}
      {installedVolume !== null && (
        <div className="text-sm bg-[var(--steel-g)] text-[var(--steel)] rounded-xl p-2 text-center">
          حجم نصب‌شده: <strong>{installedVolume.toFixed(2)}</strong> مترمکعب
        </div>
      )}

      {/* تاریخ تحویل */}
      <div className="fg">
        <label className="fl">📅 تاریخ تحویل</label>
        <input
          type="date"
          className="fi"
          value={deliveryDate}
          onChange={e => setDeliveryDate(e.target.value)}
        />
      </div>

      {/* دکمه ثبت تحویل */}
      <button
        className="btn btn-p btn-w"
        disabled={!deliverServiceTypeId || !deliverLocationTitle.trim()}
        onClick={handleDeliver}
      >
        <Icon name="check" size={18} /> تحویل به کارفرما
      </button>

      {/* لیست تحویل‌ها با Load More */}
      {deliveries.length > 0 && (
        <div className="card p-0 overflow-hidden">
          <div className="bg-[var(--bg2)] p-3 text-sm font-bold">✅ تحویل‌های ثبت‌شده</div>
          <DeliveryHistory deliveries={deliveries} deliveryVolumes={deliveryVolumes} />
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