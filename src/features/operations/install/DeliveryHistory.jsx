export default function DeliveryHistory({ deliveries, deliveryVolumes }) {
  if (!deliveries || deliveries.length === 0) return null;

  return (
    <>
      {deliveries.map((del, idx) => {
        const volume = deliveryVolumes?.[del.id];   // ← اختیاری: اگر deliveryVolumes undefined بود، خطا نده
        return (
          <div key={del.id || idx} className="px-4 py-3 border-b last:border-0 text-sm space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-medium truncate">
                {del.serviceTypeName || del.serviceType}
                {del.locationTitle && ` - ${del.locationTitle}`}
              </span>
              <span className="bdg bdg-n text-[11px] whitespace-nowrap ml-2">تحویل داده شد</span>
            </div>
            {volume !== undefined && (
              <div className="text-xs text-[var(--t2)]">
                حجم نصب: <strong>{volume.toFixed(2)} m³</strong>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}