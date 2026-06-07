import { useState, useEffect } from 'react';
import Icon from '../../../components/ui/Icon';

export default function WarehouseTab({
  warehouses,
  isAdmin,
  onNewWarehouse,
  onIn,
  onOut,
  onAdd,
  fetchAggregatedInventory,   // ← دریافت prop جدید
}) {
  const [aggregatedInventory, setAggregatedInventory] = useState({});
  const [expandId, setExpandId] = useState(null);

  const toggleExpand = async (whId) => {
    const isOpen = expandId === whId;
    setExpandId(isOpen ? null : whId);
    if (!isOpen && !aggregatedInventory[whId] && fetchAggregatedInventory) {
      const data = await fetchAggregatedInventory(whId);
      setAggregatedInventory(prev => ({ ...prev, [whId]: data || [] }));
    }
  };

  const getDistinctCount = (wh) => {
    if (aggregatedInventory[wh.id]) return aggregatedInventory[wh.id].length;
    const names = new Set((wh.inventory || []).map(i => i.equipmentName));
    return names.size;
  };

  const getDisplayInventory = (whId) => {
    if (aggregatedInventory[whId]) return aggregatedInventory[whId];
    const wh = warehouses.find(w => w.id === whId);
    return wh?.inventory || [];
  };

  return (
    <>
      {isAdmin && (
        <button className="btn btn-p btn-w" onClick={onNewWarehouse}>
          انبار جدید
        </button>
      )}
      {(warehouses || []).map(wh => {
        const isOpen = expandId === wh.id;
        const distinctCount = getDistinctCount(wh);
        return (
          <div key={wh.id} className="card p-0 overflow-hidden">
            <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleExpand(wh.id)}>
              <div>
                <h3 className="font-bold">{wh.name}</h3>
                <p className="text-xs text-[var(--t3)]">{distinctCount} قلم</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn btn-xs btn-s" onClick={(e) => { e.stopPropagation(); onIn('warehouse', wh.id); }}>📥 ورود</button>
                <button className="btn btn-xs btn-d" onClick={(e) => { e.stopPropagation(); onOut('warehouse', wh.id); }}>📤 خروج</button>
                <Icon name="chevron" size={18} color="var(--t3)" style={{ transform: isOpen ? 'rotate(180deg)' : '' }} />
              </div>
            </div>
            {isOpen && (
              <div className="border-t border-[var(--border)] p-4 space-y-3">
                {getDisplayInventory(wh.id).length === 0 ? (
                  <p className="text-sm text-[var(--t3)]">تجهیزاتی ثبت نشده</p>
                ) : (
                  getDisplayInventory(wh.id).map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.equipmentName}</span>
                      <span className="font-bold">{item.totalQuantity || item.quantity} عدد</span>
                    </div>
                  ))
                )}
                {isAdmin && (
                  <button className="btn btn-sm btn-p" onClick={(e) => { e.stopPropagation(); onAdd(wh.id); }}>
                    <Icon name="plus" size={16} /> افزودن تجهیزات
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}