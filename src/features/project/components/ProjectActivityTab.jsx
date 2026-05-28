import { toJalali } from '../../../lib/dateHelpers';

export default function ProjectActivityTab({ activities }) {
  if (!activities || activities.length === 0) {
    return <p className="text-xs text-[var(--t3)]">فعالیتی ثبت نشده</p>;
  }

  return (
    <div className="relative pr-4 border-r-2 border-[var(--border)] space-y-3">
      {activities.map((act, i) => (
        <div key={act.id || i} className="relative">
          <span
            className="absolute -right-[22px] top-1 w-3 h-3 rounded-full border-2 border-white"
            style={{ background: act.color || 'var(--t3)' }}
          />
          <div className="card text-xs">
            <div className="flex justify-between">
              <span className="font-bold">{act.activityType}</span>
              <span className="text-[var(--t3)]">{toJalali(new Date(act.date))}</span>
            </div>
            <p>
              {act.desc || (act.serviceType && `${act.serviceType} - `) || ''}
              {act.locationTitle && `${act.locationTitle} - `}
              {act.volume && `${act.volume.toFixed(1)} m³`}
              {act.equipmentType && `${act.equipmentType} (${act.quantityChange || ''})`}
              {act.description && act.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}