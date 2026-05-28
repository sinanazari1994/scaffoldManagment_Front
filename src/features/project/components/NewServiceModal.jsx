import { useState } from 'react';
import Sheet from '../../../components/ui/Sheet';

export default function NewServiceModal({ open, onClose, onSuccess }) {
  const [newServiceName, setNewServiceName] = useState('');

  const handleAdd = async () => {
    if (!newServiceName.trim()) return;
    await onSuccess(newServiceName.trim());
    setNewServiceName('');
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title="افزودن خدمت جدید">
      <div className="space-y-4">
        <div className="fg">
          <label className="fl">نام خدمت</label>
          <input
            className="fi"
            value={newServiceName}
            onChange={e => setNewServiceName(e.target.value)}
            placeholder="مثلاً: زیر بتن"
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
        </div>
        <button className="btn btn-p btn-w" onClick={handleAdd} disabled={!newServiceName.trim()}>
          ذخیره
        </button>
      </div>
    </Sheet>
  );
}