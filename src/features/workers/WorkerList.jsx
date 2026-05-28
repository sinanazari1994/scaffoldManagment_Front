import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { useData } from '../../contexts/DataContext';
import { ROLES } from '../../lib/constants';
import Icon from '../../components/ui/Icon';

export default function WorkerList() {
  const { workers } = useData();
  const navigate = useNavigate();
  const [expandId, setExpandId] = useState(null);

  const managers = workers.filter(w => w.role === ROLES.OFFICE_MANAGER);
  const staff = workers.filter(w => w.role === ROLES.WORKER);

  const WorkerCard = ({ w }) => {
    const isOpen = expandId === w.id;
    return (
      <div className="card p-0 mb-3">
        <div
          className="flex items-center gap-3 px-4 py-3 cursor-pointer"
          onClick={() => setExpandId(isOpen ? null : w.id)}
        >
          <div className="w-10 h-10 rounded-full bg-[var(--ora)] text-white flex items-center justify-center font-bold">
            {w.fullName[0]}
          </div>
          <div className="flex-1">
            <p className="font-bold">{w.fullName}</p>
            <p className="text-xs text-[var(--t3)]">@{w.username}</p>
          </div>
          <span className={`bdg ${w.role === ROLES.WORKER ? 'bdg-b' : 'bdg-o'}`}>
            {w.role === ROLES.WORKER ? 'کارگر' : 'مدیر دفتری'}
          </span>
          <Icon name="chevron" size={16} />
        </div>

        {isOpen && (
          <div className="border-t border-[var(--border)] p-4 space-y-2">
            <p className="text-sm"><strong>تلفن:</strong> {w.phone || '---'}</p>
            <button className="btn btn-sm btn-s" onClick={() => navigate('/manager/workers/new')}>
              ویرایش
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <AppLayout title="کاربران" onBack={() => navigate(-1)}>
      <div className="p-4 max-w-md mx-auto space-y-3">
        <button className="btn btn-p btn-w" onClick={() => navigate('/manager/workers/new')}>
          <Icon name="plus" size={18} /> کاربر جدید
        </button>

        {managers.length > 0 && <h3 className="text-xs font-bold text-[var(--t3)] mt-3">مدیران</h3>}
        {managers.map(w => <WorkerCard key={w.id} w={w} />)}

        {staff.length > 0 && <h3 className="text-xs font-bold text-[var(--t3)] mt-3">کارمندان</h3>}
        {staff.map(w => <WorkerCard key={w.id} w={w} />)}
      </div>
    </AppLayout>
  );
}