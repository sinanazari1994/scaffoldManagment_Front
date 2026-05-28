import { useState } from 'react';
import Sheet from '../../../components/ui/Sheet';
import { useEquipmentTypes } from '../../../contexts/EquipmentTypeContext';
import { useWarehouses } from '../../../contexts/WarehouseContext';

export default function AddEquipmentModal({ open, onClose, warehouseId, onAddSuccess }) {
  const { equipmentTypes = [], addEquipmentType } = useEquipmentTypes();
  const { addEquipmentToWarehouse } = useWarehouses();

  const [newEquipment, setNewEquipment] = useState('');
  const [newQty, setNewQty] = useState('');

  const [showNewEquipModal, setShowNewEquipModal] = useState(false);
  const [newEquipName, setNewEquipName] = useState('');

 const handleAdd = async () => {
  const qty = parseInt(newQty, 10);
  if (!qty || qty <= 0 || !newEquipment) return;
  await addEquipmentToWarehouse(warehouseId, newEquipment, qty);
  setNewEquipment('');
  setNewQty('');
  onAddSuccess(warehouseId);   // <-- ارسال شناسه انبار
};

 const handleAddNewEquipment = async () => {
  if (!newEquipName.trim()) return;
  try {
    // فقط ذخیره کن، برگشتی لازم نیست
    await addEquipmentType(newEquipName.trim());
    // مستقیماً از state خودت استفاده کن
    setNewEquipment(newEquipName.trim());
    setShowNewEquipModal(false);
    setNewEquipName('');
  } catch (err) {
    console.error('Failed to add equipment type', err);
  }
};

  return (
    <>
      <Sheet open={open} onClose={onClose} title="افزودن تجهیزات">
        <div className="space-y-4">
          <div className="fg">
            <label className="fl">نام تجهیزات</label>
            <select
              className="fi"
              value={newEquipment}
              onChange={e => {
                if (e.target.value === '__new__') {
                  setShowNewEquipModal(true);
                  return;
                }
                setNewEquipment(e.target.value);
              }}
            >
              <option key="placeholder" value="">-- انتخاب کنید --</option>
              {(equipmentTypes || [])
  .filter(eq => eq && eq.id && eq.name)   // ← این خط را اضافه کنید
  .map(eq => (
    <option key={eq.id} value={eq.name}>{eq.name}</option>
  ))}
              <option key="__new__" value="__new__" style={{ color: 'var(--ora)', fontWeight: 'bold' }}>
                + افزودن نوع جدید
              </option>
            </select>
          </div>
          <div className="fg">
            <label className="fl">تعداد</label>
            <input type="number" className="fi" value={newQty} onChange={e => setNewQty(e.target.value)} min="1" placeholder="تعداد" />
          </div>
          <button className="btn btn-p btn-w" onClick={handleAdd}>ذخیره</button>
        </div>
      </Sheet>

      <Sheet open={showNewEquipModal} onClose={() => setShowNewEquipModal(false)} title="افزودن نوع تجهیز جدید">
        <div className="space-y-4">
          <div className="fg">
            <label className="fl">نام تجهیز</label>
            <input
              className="fi"
              value={newEquipName}
              onChange={e => setNewEquipName(e.target.value)}
              placeholder="مثلاً: لوله ۶ متری"
              onKeyDown={e => e.key === 'Enter' && handleAddNewEquipment()}
            />
          </div>
          <button className="btn btn-p btn-w" onClick={handleAddNewEquipment} disabled={!newEquipName.trim()}>ذخیره</button>
        </div>
      </Sheet>
    </>
  );
}