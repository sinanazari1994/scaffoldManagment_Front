import { useState } from 'react';
import Icon from '../../../components/ui/Icon';
import { useWork } from '../../../contexts/WorkContext';
import { useServices } from '../../../contexts/ServiceContext';
import { useData } from '../../../contexts/DataContext';
import { ROLES } from '../../../lib/constants';
import DismantleHistory from './DismantleHistory';

export default function DismantleForm({
  projectId,
  selectedServiceTypeName,
  locationGroups,
  getDismantledVolume,
  fetchAllWorkEntries
}) {
  const { dismantleEntries, addDismantleEntry } = useWork();
  const { services = [] } = useServices();
  const { workers = [] } = useData();

  const [expandedId, setExpandedId] = useState(null);
  const [inputMode, setInputMode] = useState('volume');
  const [directVolume, setDirectVolume] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  const [dismantleDate, setDismantleDate] = useState(new Date().toISOString().slice(0, 10));

  const availableWorkers = (workers || []).filter(w => w.role === ROLES.WORKER);

  const computedVolume = (() => {
    if (inputMode === 'dimensions') {
      const l = parseFloat(length) || 0;
      const w = parseFloat(width) || 0;
      const h = parseFloat(height) || 0;
      return l * w * h;
    }
    return parseFloat(directVolume) || 0;
  })();

  const toggleWorker = (workerId) => {
    setSelectedWorkers(prev =>
      prev.includes(workerId) ? prev.filter(id => id !== workerId) : [...prev, workerId]
    );
  };

  const handleDismantle = async (locationTitle) => {
    if (!selectedServiceTypeName || computedVolume <= 0 || selectedWorkers.length === 0) return;

    const group = locationGroups.find(g => g.locationTitle === locationTitle);
    if (!group) return;

    const remaining = group.totalInstalledVolume - getDismantledVolume(locationTitle);
    if (computedVolume > remaining) {
      alert('حجم بازکردن بیشتر از حجم باقی‌مانده است');
      return;
    }

    await addDismantleEntry({
      projectId,
      serviceTypeName: selectedServiceTypeName,
      locationTitle,
      locationId: group.locationId || null,
      length: inputMode === 'dimensions' ? parseFloat(length) : null,
      width: inputMode === 'dimensions' ? parseFloat(width) : null,
      height: inputMode === 'dimensions' ? parseFloat(height) : null,
      volume: computedVolume,
      workerIds: selectedWorkers,
      date: dismantleDate,
    });

    await fetchAllWorkEntries();

    setDirectVolume('');
    setLength('');
    setWidth('');
    setHeight('');
    setSelectedWorkers([]);
    setDismantleDate(new Date().toISOString().slice(0, 10));
  };

  const handleAddRemaining = async (locationTitle) => {
    if (!selectedServiceTypeName) return;

    const group = locationGroups.find(g => g.locationTitle === locationTitle);
    if (!group) return;

    const remaining = group.totalInstalledVolume - getDismantledVolume(locationTitle);
    if (remaining <= 0) return;

    await addDismantleEntry({
      projectId,
      serviceTypeName: selectedServiceTypeName,
      locationTitle,
      locationId: group.locationId || null,
      volume: remaining,
      workerIds: [],
      date: dismantleDate,
    });

    await fetchAllWorkEntries();
  };

  // تاریخچه بازکردن‌ها برای یک آدرس
  const getHistory = (locationTitle) => {
    return (dismantleEntries || [])
      .filter(
        d =>
          d.projectId === projectId &&
          d.serviceTypeName === selectedServiceTypeName &&
          d.locationTitle === locationTitle
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  if (!selectedServiceTypeName || locationGroups.length === 0) {
    return (
      <div className="empty">
        <div className="empty-icon">📭</div>
        <h3 className="empty-title">نصبی برای این خدمت ثبت نشده</h3>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {locationGroups.map(group => {
        const dismantledVol = getDismantledVolume(group.locationTitle);
        const remainingVol = group.totalInstalledVolume - dismantledVol;
        const isExpanded = expandedId === group.locationTitle;
        const history = getHistory(group.locationTitle);

        return (
          <div key={group.locationTitle} className="card p-0 overflow-hidden">
            {/* سربرگ آدرس */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : group.locationTitle)}
            >
              <div>
                <span className="font-bold text-base">{group.locationTitle}</span>
                <div className="text-sm mt-1 space-y-1">
                  <p>
                    نصب‌شده:{' '}
                    <span className="font-bold text-[var(--ora)]">
                      {group.totalInstalledVolume.toFixed(2)} m³
                    </span>
                  </p>
                  <p>
                    بازشده:{' '}
                    <span className="font-bold text-[var(--red)]">
                      {dismantledVol.toFixed(2)} m³
                    </span>
                    {remainingVol > 0 ? (
                      <span className="text-xs text-[var(--t3)] ml-2">
                        (باقی‌مانده: {remainingVol.toFixed(2)} m³)
                      </span>
                    ) : (
                      <span className="text-xs text-[var(--green)] mr-2">✓ کامل</span>
                    )}
                  </p>
                </div>
              </div>
              <Icon
                name="chevron"
                size={18}
                color="var(--t3)"
                style={{ transform: isExpanded ? 'rotate(180deg)' : '' }}
              />
            </div>

            {/* پنل کشویی */}
            {isExpanded && (
              <div className="border-t border-[var(--border)] p-4 space-y-3">
                <DismantleHistory history={history} />

                {remainingVol > 0 && (
                  <>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setInputMode('volume')}
                        className={`btn btn-sm flex-1 ${inputMode === 'volume' ? 'btn-p' : 'btn-s'}`}>
                        حجم مستقیم
                      </button>
                      <button type="button" onClick={() => setInputMode('dimensions')}
                        className={`btn btn-sm flex-1 ${inputMode === 'dimensions' ? 'btn-p' : 'btn-s'}`}>
                        با ابعاد
                      </button>
                    </div>

                    {inputMode === 'volume' && (
                      <div className="fg">
                        <label className="fl">میزان بازکردن (مترمکعب)</label>
                        <input type="number" className="fi text-center text-2xl font-bold"
                          placeholder="۰" value={directVolume}
                          onChange={e => setDirectVolume(e.target.value)} min="0" step="0.1" />
                      </div>
                    )}

                    {inputMode === 'dimensions' && (
                      <div className="g3">
                        <div className="fg">
                          <label className="fl">طول (متر)</label>
                          <input type="number" className="fi" value={length} onChange={e => setLength(e.target.value)} min="0" step="0.01" />
                        </div>
                        <div className="fg">
                          <label className="fl">عرض (متر)</label>
                          <input type="number" className="fi" value={width} onChange={e => setWidth(e.target.value)} min="0" step="0.01" />
                        </div>
                        <div className="fg">
                          <label className="fl">ارتفاع (متر)</label>
                          <input type="number" className="fi" value={height} onChange={e => setHeight(e.target.value)} min="0" step="0.01" />
                        </div>
                      </div>
                    )}

                    {computedVolume > 0 && (
                      <div className="text-sm bg-[var(--steel-g)] text-[var(--steel)] rounded-xl p-2 text-center">
                        حجم بازکردن: <strong>{computedVolume.toFixed(2)}</strong> m³
                      </div>
                    )}

                    <div>
                      <label className="fl">👷 کارگران</label>
                      <div className="grid grid-cols-2 gap-2">
                        {availableWorkers.map(w => (
                          <button key={w.id} type="button" onClick={() => toggleWorker(w.id)}
                            className={`chip ${selectedWorkers.includes(w.id) ? 'on' : ''}`}>
                            {selectedWorkers.includes(w.id) ? '✅ ' : ''}{w.fullName}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="fg">
                      <label className="fl">📅 تاریخ بازکردن</label>
                      <input type="date" className="fi" value={dismantleDate}
                        onChange={e => setDismantleDate(e.target.value)} />
                    </div>

                    <button className="btn btn-d btn-w"
                      disabled={computedVolume <= 0 || selectedWorkers.length === 0}
                      onClick={() => handleDismantle(group.locationTitle)}>
                      <Icon name="check" size={18} /> ثبت بازکردن
                    </button>

                    <button className="btn btn-s btn-w"
                      onClick={() => handleAddRemaining(group.locationTitle)}>
                      <Icon name="check" size={18} /> ثبت کل حجم باقی‌مانده ({remainingVol.toFixed(2)} m³)
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}