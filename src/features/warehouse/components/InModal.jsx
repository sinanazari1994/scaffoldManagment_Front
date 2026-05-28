import { useState, useMemo } from 'react';
import Sheet from '../../../components/ui/Sheet';
import { useTransfers } from '../../../contexts/TransfersContext';

export default function InModal({ open, onClose, onSuccess, pendingTransfers, warehouses, projects, entityType, entityId }) {
  const [inItems, setInItems] = useState({});

  const allPendingSummary = useMemo(() => {
    const summary = {};
    (pendingTransfers || []).forEach(t => {
      (t.items || []).forEach(item => {
        const key = item.equipmentName || item.name;
        if (key) summary[key] = (summary[key] || 0) + item.quantity;
      });
    });
    return summary;
  }, [pendingTransfers]);

  const handleInSubmit = () => {
    const itemsArray = Object.entries(inItems)
      .filter(([_, qty]) => qty > 0)
      .map(([name, qty]) => ({ name, quantity: qty }));
    if (itemsArray.length === 0) return;
    onSuccess(itemsArray);
  };

  return (
    <Sheet open={open} onClose={onClose} title="📥 ورود تجهیزات">
      <div className="space-y-3">
        {Object.keys(allPendingSummary).length === 0 ? (
          <p className="text-sm text-[var(--t3)]">هیچ تجهیزاتی در حال انتقال نیست</p>
        ) : (
          <>
            {Object.entries(allPendingSummary).map(([eq, totalPending]) => (
              <div key={`in-${eq}`} className="flex items-center justify-between">
                <span className="text-sm">{eq} (در حال انتقال: {totalPending})</span>
                <input
                  type="number"
                  className="fi w-20 text-center"
                  min="0"
                  max={totalPending}
                  value={inItems[eq] || 0}
                  onChange={e => {
                    const val = parseInt(e.target.value, 10) || 0;
                    setInItems(prev => ({ ...prev, [eq]: Math.min(val, totalPending) }));
                  }}
                />
              </div>
            ))}
            <button className="btn btn-p btn-w" onClick={handleInSubmit}>تأیید ورود</button>
          </>
        )}
      </div>
    </Sheet>
  );
}