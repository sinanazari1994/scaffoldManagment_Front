// src/features/warehouse/components/AddEquipmentTypeModal.jsx
import { useState } from 'react';
import Sheet from '../../../components/ui/Sheet';
import { useEquipmentTypes } from '../../../contexts/EquipmentTypeContext';

export default function AddEquipmentTypeModal({ open, onClose }) {
  const { addEquipmentType } = useEquipmentTypes();
  const [newEquipName, setNewEquipName] = useState('');

  const handleAdd = async () => {
    if (!newEquipName.trim()) return;
    try {
      await addEquipmentType(newEquipName.trim());
      onClose();
    } catch (err) {
      console.error('Failed to add equipment type', err);
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title="افزودن نوع تجهیز جدید">
      <div className="space-y-4">
        <div className="fg">
          <label className="fl">نام تجهیز</label>
          <input
            className="fi"
            value={newEquipName}
            onChange={e => setNewEquipName(e.target.value)}
            placeholder="مثلاً: لوله ۶ متری"
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
        </div>
        <button
          className="btn btn-p btn-w"
          onClick={handleAdd}
          disabled={!newEquipName.trim()}
        >
          ذخیره
        </button>
      </div>
    </Sheet>
  );
}