import { useState, useMemo } from 'react';
import { useWork } from '../../contexts/WorkContext';
import DismantleForm from './dismantle/DismantleForm';

export default function DismantleWorkPanel({ projectId }) {
  const { installEntries, dismantleEntries, fetchAllWorkEntries } = useWork();
  const [selectedServiceTypeName, setSelectedServiceTypeName] = useState('');

  const serviceTypes = useMemo(() => {
    const types = (installEntries || [])
      .filter(e => e.projectId === projectId && e.serviceTypeName)
      .map(e => e.serviceTypeName);
    return [...new Set(types)];
  }, [installEntries, projectId]);

  const locationGroups = useMemo(() => {
    if (!selectedServiceTypeName) return [];
    const entries = (installEntries || []).filter(
      e => e.projectId === projectId && e.serviceTypeName === selectedServiceTypeName
    );
    const map = {};
    entries.forEach(e => {
      const key = e.locationTitle || 'بدون نام';
      if (!map[key]) {
        map[key] = { locationTitle: key, locationId: e.locationId, totalInstalledVolume: 0 };
      }
      map[key].totalInstalledVolume += e.volume || 0;
      if (!map[key].locationId && e.locationId) map[key].locationId = e.locationId;
    });
    return Object.values(map);
  }, [installEntries, projectId, selectedServiceTypeName]);

  const getDismantledVolume = (locationTitle) => {
    return (dismantleEntries || [])
      .filter(d => d.projectId === projectId &&
                   d.serviceTypeName === selectedServiceTypeName &&
                   d.locationTitle === locationTitle)
      .reduce((sum, d) => sum + (d.volume || 0), 0);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">🔨 بازکردن داربست</h3>

      <div className="card space-y-3">
        <div className="fg">
          <label className="fl">نوع عملیات نصب‌شده</label>
          <select
            className="fi"
            value={selectedServiceTypeName}
            onChange={e => setSelectedServiceTypeName(e.target.value)}
          >
            <option value="">-- انتخاب کنید --</option>
            {serviceTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <DismantleForm
        projectId={projectId}
        selectedServiceTypeName={selectedServiceTypeName}
        locationGroups={locationGroups}
        getDismantledVolume={getDismantledVolume}
        fetchAllWorkEntries={fetchAllWorkEntries}
      />
    </div>
  );
}