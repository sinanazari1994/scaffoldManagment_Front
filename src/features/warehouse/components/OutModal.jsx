import { useState, useEffect } from 'react';
import Sheet from '../../../components/ui/Sheet';
import { useWarehouses } from '../../../contexts/WarehouseContext';
import { useProjects } from '../../../contexts/ProjectContext';

export default function OutModal({ open, onClose, onSuccess, warehouses, projects, entityType, entityId }) {
  const { fetchAggregatedInventory } = useWarehouses();
  const [outItems, setOutItems] = useState({});
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    if (!open || !entityType || !entityId) return;
    const loadInventory = async () => {
      if (entityType === 'warehouse') {
        const data = await fetchAggregatedInventory(entityId);
        setInventory(data || []);
        const init = {};
        (data || []).forEach(inv => { init[inv.equipmentName || inv.name] = 0; });
        setOutItems(init);
      } else {
        const proj = projects.find(p => p.id === entityId);
        const inv = proj?.inventory || [];
        setInventory(inv);
        const init = {};
        inv.forEach(item => { init[item.equipmentName || item.name] = 0; });
        setOutItems(init);
      }
    };
    loadInventory();
  }, [open, entityType, entityId, fetchAggregatedInventory, projects]);

  const handleOutSubmit = () => {
    const itemsArray = Object.entries(outItems)
      .filter(([_, qty]) => qty > 0)
      .map(([name, qty]) => ({ name, quantity: qty }));
    if (itemsArray.length === 0) return;
    onSuccess(itemsArray);
  };

  return (
    <Sheet open={open} onClose={onClose} title="📤 خروج تجهیزات">
      <div className="space-y-3">
        {inventory.length === 0 ? (
          <p className="text-sm text-[var(--t3)]">موجودی خالی است</p>
        ) : (
          <>
            {inventory.map(inv => {
              const eq = inv.equipmentName || inv.name;
              const maxQty = inv.totalQuantity || inv.quantity || 0;
              const qty = outItems[eq] || 0;
              return (
                <div key={`out-${eq}`} className="flex items-center justify-between">
                  <span className="text-sm">{eq} (موجودی: {maxQty})</span>
                  <input
                    type="number"
                    className="fi w-20 text-center"
                    min="0"
                    max={maxQty}
                    value={qty}
                    onChange={e => {
                      const val = parseInt(e.target.value, 10) || 0;
                      setOutItems(prev => ({ ...prev, [eq]: Math.min(val, maxQty) }));
                    }}
                  />
                </div>
              );
            })}
            <button className="btn btn-d btn-w" onClick={handleOutSubmit}>تأیید خروج</button>
          </>
        )}
      </div>
    </Sheet>
  );
}