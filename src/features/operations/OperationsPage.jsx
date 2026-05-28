import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Icon from '../../components/ui/Icon';
import { useProjects } from '../../contexts/ProjectContext';
import InstallWorkPanel from './InstallWorkPanel';
import DismantleWorkPanel from './DismantleWorkPanel';

export default function OperationsPage() {
  const { projectId } = useParams();
  const { projects } = useProjects();
  const navigate = useNavigate();
  const [tab, setTab] = useState('install'); // حالا فقط دو تب داریم

  const project = projects.find(p => p.id === projectId);
  if (!project) {
    return (
      <AppLayout title="پروژه یافت نشد" onBack={() => navigate(-1)}>
        <div className="p-4 text-center">پروژه‌ای با این شناسه وجود ندارد.</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={project.employerName} onBack={() => navigate(-1)}>
      <div className="p-4 max-w-md mx-auto space-y-4">
        <div className="flex gap-2 bg-[var(--bg2)] rounded-xl p-1">
          {[
            { key: 'install', label: 'نصب', icon: 'hardhat' },
            { key: 'dismantle', label: 'بازکردن', icon: 'trash' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-1 ${
                tab === t.key ? 'bg-white shadow text-[var(--ora)]' : 'text-[var(--t3)]'
              }`}
            >
              <Icon name={t.icon} size={16} />
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'install' && <InstallWorkPanel projectId={project.id} />}
        {tab === 'dismantle' && <DismantleWorkPanel projectId={project.id} />}
      </div>
    </AppLayout>
  );
}