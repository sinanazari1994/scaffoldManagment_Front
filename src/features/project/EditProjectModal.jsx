import { useState, useEffect, useMemo } from 'react';
import Sheet from '../../components/ui/Sheet';
import Icon from '../../components/ui/Icon';
import { useProjects } from '../../contexts/ProjectContext';
import { useServices } from '../../contexts/ServiceContext';

export default function EditProjectModal({ project, open, onClose }) {
  const { editProject } = useProjects();
  const { services = [], addService, fetchServices } = useServices();

  const [employerName, setEmployerName] = useState('');
  const [employerPhone, setEmployerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [monthlyRentPercent, setMonthlyRentPercent] = useState(0);

  const [selectedServices, setSelectedServices] = useState([]);
  const [currentServiceId, setCurrentServiceId] = useState('');
  const [currentPriceRaw, setCurrentPriceRaw] = useState('');
  const [currentPriceDisplay, setCurrentPriceDisplay] = useState('');

  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');

  useEffect(() => {
    if (project) {
      setEmployerName(project.employerName || '');
      setEmployerPhone(project.employerPhone || '');
      setAddress(project.address || '');
      setMonthlyRentPercent(project.monthlyRentPercent || 0);
      setSelectedServices(project.servicePrices ? [...project.servicePrices] : []);
      setCurrentServiceId('');
      setCurrentPriceRaw('');
      setCurrentPriceDisplay('');
    }
  }, [project, open]);

  const availableServices = useMemo(() => {
    const selectedNames = new Set(selectedServices.map(s => s.serviceTypeName));
    return (services || []).filter(s => !selectedNames.has(s.name));
  }, [services, selectedServices]);

  // فرمت با جداکنندهٔ انگلیسی (1,000,000)
  const formatPrice = (raw) => {
    if (!raw) return '';
    const num = parseInt(raw, 10);
    return isNaN(num) ? '' : new Intl.NumberFormat('en-US').format(num);
  };

  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setCurrentPriceRaw(raw);
    setCurrentPriceDisplay(formatPrice(raw));
  };

  const addServiceItem = () => {
    const price = parseInt(currentPriceRaw, 10);
    if (!currentServiceId || isNaN(price) || price <= 0) return;

    const service = services.find(s => s.id === currentServiceId);
    if (!service) return;

    setSelectedServices(prev => [
      ...prev,
      { serviceTypeId: service.id, serviceTypeName: service.name, price },
    ]);
    setCurrentPriceRaw('');
    setCurrentPriceDisplay('');
    setCurrentServiceId('');
  };

  const removeService = (index) => {
    setSelectedServices(prev => prev.filter((_, i) => i !== index));
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

  const handleSave = async () => {
    if (!employerName.trim() || !address.trim()) return;

    const payload = {
      employerName: employerName.trim(),
      employerPhone: employerPhone.trim(),
      address: address.trim(),
      monthlyRentPercent: Number(monthlyRentPercent) || 0,
      servicePrices: selectedServices.map(s => ({
        serviceTypeId: s.serviceTypeId || null,
        serviceTypeName: s.serviceTypeName || '',
        price: s.price,
      })),
    };

    await editProject(project.id, payload);
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title="ویرایش پروژه">
      <div className="space-y-4">
        <div className="fg">
          <label className="fl">نام کارفرما *</label>
          <input className="fi" value={employerName} onChange={e => setEmployerName(e.target.value)} placeholder="نام کامل" />
        </div>
        <div className="fg">
          <label className="fl">شماره موبایل</label>
          <input className="fi" value={employerPhone} onChange={e => setEmployerPhone(e.target.value)} placeholder="۰۹۱۲xxxxxxx" />
        </div>
        <div className="fg">
          <label className="fl">آدرس پروژه *</label>
          <input className="fi" value={address} onChange={e => setAddress(e.target.value)} placeholder="آدرس دقیق" />
        </div>
        <div className="fg">
          <label className="fl">درصد اجاره ماهیانه</label>
          <input type="number" className="fi" value={monthlyRentPercent} onChange={e => setMonthlyRentPercent(e.target.value)} min="0" max="100" />
        </div>

        {/* خدمات و قیمت‌ها */}
        <div className="border-t border-[var(--border)] pt-3">
          <h4 className="font-bold mb-2">💰 خدمات و قیمت‌ها</h4>

          <div className="space-y-2 mb-3">
            {selectedServices.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between bg-[var(--bg2)] rounded-lg p-2">
                <span className="font-medium">{s.serviceTypeName || 'سرویس'}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[var(--ora)]">{s.price?.toLocaleString()} تومان</span>
                  <button onClick={() => removeService(idx)} className="text-[var(--red)]">
                    <Icon name="x" size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* انتخاب سرویس + قیمت + دکمه + */}
          <div className="flex gap-2 items-end">
            <div className="fg flex-1">
              <label className="fl">نوع خدمت</label>
              <select
                className="fi"
                value={currentServiceId}
                onChange={e => {
                  if (e.target.value === '__new__') {
                    setShowNewServiceModal(true);
                    return;
                  }
                  setCurrentServiceId(e.target.value);
                }}
              >
                <option value="">-- انتخاب کنید --</option>
                {availableServices.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
                <option value="__new__" style={{ color: 'var(--ora)', fontWeight: 'bold' }}>
                  + افزودن نوع جدید
                </option>
              </select>
            </div>

            <div className="fg w-28">
              <label className="fl">قیمت (تومان)</label>
              <input
                type="text"
                inputMode="numeric"
                className="fi text-center"
                placeholder="۰"
                value={currentPriceDisplay}
                onChange={handlePriceChange}
              />
            </div>

            {/* دکمهٔ + با لیبل مخفی برای تراز شدن */}
            <div className="fg">
              <label className="fl invisible">+</label>
              <button
                type="button"
                onClick={addServiceItem}
                className="btn btn-p h-[54px] px-4 text-xl"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button className="btn btn-s btn-w" onClick={onClose}>انصراف</button>
          <button className="btn btn-p btn-w" onClick={handleSave}>ذخیره تغییرات</button>
        </div>
      </div>

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
          <button className="btn btn-p btn-w" onClick={handleAddNewService} disabled={!newServiceName.trim()}>ذخیره</button>
        </div>
      </Sheet>
    </Sheet>
  );
}