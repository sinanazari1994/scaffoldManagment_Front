import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { useProjects } from '../../contexts/ProjectContext';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES } from '../../lib/constants';
import Icon from '../../components/ui/Icon';

export default function WorkerProjectList() {
  const { projects } = useProjects();
  const { user } = useAuth();
  const navigate = useNavigate();

  const activeProjects = projects.filter(p => !p.isCompleted);

  const handleProjectClick = (projId) => {
    if (user.role === ROLES.WORKER) {
      navigate(`/worker/projects/${projId}/operations`);
    } else {
      navigate(`/manager/operations/${projId}`);
    }
  };

  return (
    <AppLayout title={`پروژه‌ها | ${user.fullName}`} showNav={false}>
      <div className="p-4 max-w-md mx-auto space-y-3">
        {activeProjects.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🏗️</div>
            <h3 className="empty-title">پروژهٔ فعالی وجود ندارد</h3>
            <p className="empty-subtitle">همهٔ پروژه‌ها پایان یافته‌اند</p>
          </div>
        ) : (
          activeProjects.map(proj => (
            <div
              key={proj.id}
              className="card flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => handleProjectClick(proj.id)}
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--bg2)] flex items-center justify-center">
                <Icon name="hardhat" size={20} color="var(--ora)" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-base">{proj.employerName}</p>
                <p className="text-xs text-[var(--t3)]">{proj.address}</p>
              </div>
              <Icon name="chevron" size={18} color="var(--t3)" />
            </div>
          ))
        )}
      </div>
    </AppLayout>
  );
}