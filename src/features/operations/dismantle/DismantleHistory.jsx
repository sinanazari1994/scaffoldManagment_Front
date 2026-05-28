import { toJalali } from '../../../lib/dateHelpers';

export default function DismantleHistory({ history }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="space-y-1">
      <p className="text-xs font-bold text-[var(--t3)]">تاریخچه بازکردن:</p>
      {history.map(d => (
        <div key={d.id} className="flex justify-between text-xs bg-[var(--bg2)] rounded-lg p-2">
          <span>{d.volume?.toFixed(2)} m³</span>
          <span>{toJalali(new Date(d.date))}</span>
        </div>
      ))}
    </div>
  );
}