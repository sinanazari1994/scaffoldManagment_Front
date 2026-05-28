import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Icon from '../../components/ui/Icon';
import { useServices } from '../../contexts/ServiceContext';
import { useWork } from '../../contexts/WorkContext';
import { useLocations } from '../../contexts/LocationContext';

export default function ServicesPage() {
  const { services, addService, removeService, editService, fetchServices } = useServices();
  const { fetchAllWorkEntries } = useWork();
  const { fetchLocations } = useLocations();
  const navigate = useNavigate();
  const [newServiceName, setNewServiceName] = useState('');
  const [editingService, setEditingService] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleAdd = async () => {
    if (!newServiceName.trim()) return;
    try {
      await addService(newServiceName.trim());
      setNewServiceName('');
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (service) => {
    setEditingService(service);
    setEditValue(service.name);
  };

  const saveEdit = async () => {
    if (editingService && editValue.trim()) {
      try {
        await editService(editingService.id, editValue.trim());
        // به‌روزرسانی Contextهای وابسته
        await fetchAllWorkEntries();
        await fetchLocations();
        setEditingService(null);
        setEditValue('');
        fetchServices();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const cancelEdit = () => {
    setEditingService(null);
    setEditValue('');
  };

  const handleDelete = async (service) => {
    if (!confirm('آیا از حذف این خدمت اطمینان دارید؟')) return;
    try {
      await removeService(service.id);
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppLayout title="خدمات داربست‌بندی" onBack={() => navigate(-1)}>
      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* فرم افزودن */}
        <div className="card space-y-3">
          <h3 className="font-bold text-lg">افزودن خدمت جدید</h3>
          <div className="flex gap-2 items-end">
            <div className="fg flex-1">
              <label className="fl">نام خدمت</label>
              <input
                className="fi"
                value={newServiceName}
                onChange={e => setNewServiceName(e.target.value)}
                placeholder="مثلاً: زیر بتن"
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <button className="btn btn-p h-[54px] px-4 text-xl" onClick={handleAdd}>
              +
            </button>
          </div>
        </div>

        {/* لیست خدمات */}
        <div className="card p-0 overflow-hidden">
          <div className="bg-[var(--bg2)] p-3 text-sm font-bold">
            📋 خدمات تعریف‌شده ({services.length})
          </div>
          {services.length === 0 ? (
            <div className="p-4 text-center text-sm text-[var(--t3)]">هیچ خدمتی تعریف نشده است</div>
          ) : (
            services.map(service => (
              <div
                key={service.id || service.name}
                className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] last:border-0"
              >
                {editingService?.id === service.id ? (
                  // حالت ویرایش
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      className="fi flex-1 py-1 text-sm"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveEdit()}
                      autoFocus
                    />
                    <button className="btn btn-xs btn-m" onClick={saveEdit}>✓</button>
                    <button className="btn btn-xs btn-g" onClick={cancelEdit}>✕</button>
                  </div>
                ) : (
                  // حالت نمایش
                  <>
                    <span className="text-sm">{service.name}</span>
                    <div className="flex items-center gap-1">
                      <button className="btn btn-xs btn-g" onClick={() => startEdit(service)}>
                        <Icon name="edit" size={14} />
                      </button>
                      <button
                        className="btn btn-xs btn-g text-[var(--red)]"
                        onClick={() => handleDelete(service)}
                      >
                        <Icon name="x" size={14} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}