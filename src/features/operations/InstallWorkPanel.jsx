import { useState } from 'react';
import InstallRecordForm from './install/InstallRecordForm';
import DeliveryForm from './install/DeliveryForm';

export default function InstallWorkPanel({ projectId }) {
  const [innerTab, setInnerTab] = useState('record'); // 'record' | 'deliver'

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">🔧 نصب داربست</h3>

      {/* تب‌های ثبت / تحویل */}
      <div className="flex gap-2">
        <button
          onClick={() => setInnerTab('record')}
          className={`btn btn-sm flex-1 ${innerTab === 'record' ? 'btn-p' : 'btn-s'}`}
        >
          📝 ثبت کار
        </button>
        <button
          onClick={() => setInnerTab('deliver')}
          className={`btn btn-sm flex-1 ${innerTab === 'deliver' ? 'btn-p' : 'btn-s'}`}
        >
          ✅ تحویل به کارفرما
        </button>
      </div>

      {innerTab === 'record' && <InstallRecordForm projectId={projectId} />}
      {innerTab === 'deliver' && <DeliveryForm projectId={projectId} />}
    </div>
  );
}