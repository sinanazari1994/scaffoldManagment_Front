import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Icon from '../../components/ui/Icon';
import { useEquipmentTypes } from '../../contexts/EquipmentTypeContext';

export default function EquipmentTypesPage() {
  const { equipmentTypes, isLoading, fetchAll } = useEquipmentTypes();
  const navigate = useNavigate();
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleAdd = async () => {
    const { default: api } = await import('../../services/api');
    const { ENDPOINTS } = await import('../../services/endpoints');
    if (!newName.trim()) return;
    try {
      await api.post(ENDPOINTS.EQUIPMENT_TYPES, { name: newName.trim() });
      setNewName('');
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async () => {
    const { default: api } = await import('../../services/api');
    const { ENDPOINTS } = await import('../../services/endpoints');
    if (!editValue.trim() || !editingId) return;
    try {
      await api.put(`${ENDPOINTS.EQUIPMENT_TYPES}/${editingId}`, { id: editingId, name: editValue.trim() });
      setEditingId(null);
      setEditValue('');
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const { default: api } = await import('../../services/api');
    const { ENDPOINTS } = await import('../../services/endpoints');
    if (!confirm('آیا از حذف این تجهیز اطمینان دارید؟')) return;
    try {
      await api.delete(`${ENDPOINTS.EQUIPMENT_TYPES}/${id}`);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppLayout title="تجهیزات" onBack={() => navigate(-1)}>
      <div className="p-4 max-w-md mx-auto space-y-4">
        <div className="card space-y-3">
          <h3 className="font-bold text-lg">افزودن تجهیز جدید</h3>
          <div className="flex gap-2 items-end">
            <div className="fg flex-1">
              <label className="fl">نام تجهیز</label>
              <input
                className="fi"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="مثلاً: لوله ۶ متری"
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <button className="btn btn-p h-[54px] px-4 text-xl" onClick={handleAdd}>+</button>
          </div>
        </div>

        <div className="card p-0 overflow-hidden">
          <div className="bg-[var(--bg2)] p-3 text-sm font-bold">
            📋 تجهیزات تعریف‌شده ({equipmentTypes.length})
          </div>
          {equipmentTypes.length === 0 ? (
            <div className="p-4 text-center text-sm text-[var(--t3)]">هیچ تجهیزی تعریف نشده است</div>
          ) : (
            equipmentTypes.map(eq => (
              <div key={eq.id} className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] last:border-0">
                {editingId === eq.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      className="fi flex-1 py-1 text-sm"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleEdit()}
                      autoFocus
                    />
                    <button className="btn btn-xs btn-m" onClick={handleEdit}>✓</button>
                    <button className="btn btn-xs btn-g" onClick={() => setEditingId(null)}>✕</button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm">{eq.name}</span>
                    <div className="flex items-center gap-1">
                      <button className="btn btn-xs btn-g" onClick={() => { setEditingId(eq.id); setEditValue(eq.name); }}>
                        <Icon name="edit" size={14} />
                      </button>
                      <button className="btn btn-xs btn-g text-[var(--red)]" onClick={() => handleDelete(eq.id)}>
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