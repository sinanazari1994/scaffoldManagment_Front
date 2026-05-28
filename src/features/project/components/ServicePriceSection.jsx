import { useState, useMemo } from 'react';
import Icon from '../../../components/ui/Icon';
import { useServices } from '../../../contexts/ServiceContext';
import NewServiceModal from './NewServiceModal';

export default function ServicePriceSection({ selectedServices, onServicesChange }) {
  const { services = [], addService, fetchServices } = useServices();

  const [currentServiceId, setCurrentServiceId] = useState('');
  const [currentPriceRaw, setCurrentPriceRaw] = useState('');
  const [currentPriceDisplay, setCurrentPriceDisplay] = useState('');

  const [showNewServiceModal, setShowNewServiceModal] = useState(false);

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
    // فقط ارقام را نگه دار
    const raw = e.target.value.replace(/\D/g, '');
    setCurrentPriceRaw(raw);
    setCurrentPriceDisplay(formatPrice(raw));
  };

  const addServiceItem = () => {
    const price = parseInt(currentPriceRaw, 10);
    if (!currentServiceId || isNaN(price) || price <= 0) return;

    const service = services.find(s => s.id === currentServiceId);
    if (!service) return;

    onServicesChange(prev => [
      ...prev,
      { serviceTypeId: service.id, serviceTypeName: service.name, price },
    ]);
    setCurrentServiceId('');
    setCurrentPriceRaw('');
    setCurrentPriceDisplay('');
  };

  const removeServiceItem = (index) => onServicesChange(prev => prev.filter((_, i) => i !== index));

  return (
    <>
      <div className="card space-y-4">
        <h3 className="font-bold text-lg">💰 خدمات و قیمت‌ها</h3>

        {selectedServices.length > 0 && (
          <div className="space-y-2">
            {selectedServices.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-[var(--bg2)] rounded-lg p-2.5">
                <span className="font-medium">{item.serviceTypeName}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[var(--ora)]">{item.price.toLocaleString()} تومان</span>
                  <button type="button" onClick={() => removeServiceItem(idx)} className="text-[var(--red)]">
                    <Icon name="x" size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

       <div className="border-t border-[var(--border)] pt-3">
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
  <option key="empty" value="">-- انتخاب کنید --</option>
  {(availableServices || []).map(s => (
    <option key={s.id} value={s.id}>{s.name}</option>
  ))}
  <option key="__new__" value="__new__" style={{ color: 'var(--ora)', fontWeight: 'bold' }}>
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
      </div>

      <NewServiceModal
        open={showNewServiceModal}
        onClose={() => setShowNewServiceModal(false)}
        onSuccess={async (newServiceName) => {
          await addService(newServiceName);
          await fetchServices();
        }}
      />
    </>
  );
}