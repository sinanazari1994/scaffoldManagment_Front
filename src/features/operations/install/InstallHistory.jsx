import Icon from '../../../components/ui/Icon';

export default function InstallHistory({ installs, availableWorkers, expandedId, setExpandedId }) {
  if (!installs || installs.length === 0) return null;

  return (
    <>
      {installs.map((entry, idx) => {
        const isExpanded = expandedId === entry.id;
        return (
          <div
            key={entry.id || idx}
            className="border-b border-[var(--border)] last:border-0 cursor-pointer transition-colors hover:bg-[var(--bg2)]"
            onClick={() => setExpandedId(isExpanded ? null : entry.id)}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm truncate">
                    {entry.serviceTypeName || entry.serviceType}
                  </span>
                  {entry.locationTitle && (
                    <span className="text-xs text-[var(--t3)] truncate">📍 {entry.locationTitle}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 ml-3">
                <span className="text-sm font-bold text-[var(--ora)] whitespace-nowrap">
                  {(entry.volume || 0).toFixed(1)} m³
                </span>
                <Icon
                  name="chevron"
                  size={16}
                  color="var(--t3)"
                  style={{
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                />
              </div>
            </div>
            {isExpanded && (
              <div className="px-4 pb-3 space-y-2 animate-[fadeSlideDown_0.2s_ease]">
                <div className="flex items-center gap-4 text-xs text-[var(--t2)]">
                  <span>ابعاد: {entry.length ?? '-'} × {entry.width ?? '-'} × {entry.height ?? '-'}</span>
                </div>
                {(entry.workerIds || entry.workers || []).length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {(entry.workerIds || entry.workers || []).map(wid => {
                      const worker = availableWorkers.find(w => w.id === wid);
                      return (
                        <span key={wid} className="bdg bdg-n text-xs">{worker?.fullName || wid}</span>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}