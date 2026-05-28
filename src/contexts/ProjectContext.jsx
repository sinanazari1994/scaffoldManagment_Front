import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import api from '../services/api';
import { ENDPOINTS } from '../services/endpoints';

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ========== Fetch ==========
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get(ENDPOINTS.PROJECTS);
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch projects', err);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

const fetchProjectFinancials = useCallback(async (projectId) => {
  try {
    const res = await api.get(ENDPOINTS.PROJECT_FINANCIALS(projectId));
    return res.data;
  } catch (err) {
    console.error('Failed to fetch project financials', err);
    return null;
  }
}, []);



  // ========== Mutate ==========
 const addProject = useCallback(async (projectData) => {
  try {
    const res = await api.post(ENDPOINTS.PROJECTS, projectData);
    setProjects(prev => [...prev, res.data]);
  } catch (err) {
    const message = err.response?.data?.message || '';
    if (message.startsWith('PLAN_LIMIT_REACHED')) {
      const reason = message.split(':')[1] || 'projects';
      window.location.href = `/plan-limit?reason=${reason}`;
      return;
    }
    throw err;
  }
}, []);

  const editProject = useCallback(async (projectId, newData) => {
    try {
      // اطمینان از اینکه projectId در بدنه هم وجود دارد
      const payload = { ...newData, projectId };
      console.log('PUT payload:', payload);

      await api.put(`${ENDPOINTS.PROJECTS}/${projectId}`, payload);
      setProjects(prev =>
        prev.map(p => (p.id === projectId ? { ...p, ...newData } : p))
      );
    } catch (err) {
      console.error('Edit project failed:', err.response?.data);
      throw err;
    }
  }, []);

  const toggleProjectCompleted = useCallback(async (projectId) => {
    try {
      await api.patch(`${ENDPOINTS.PROJECTS}/${projectId}/complete`);
      setProjects(prev =>
        prev.map(p =>
          p.id === projectId ? { ...p, isCompleted: !p.isCompleted } : p
        )
      );
    } catch (err) {
      console.error('Toggle completed failed:', err);
      throw err;
    }
  }, []);

  const toggleProjectPaid = useCallback(async (projectId) => {
    try {
      await api.patch(`${ENDPOINTS.PROJECTS}/${projectId}/paid`);
      setProjects(prev =>
        prev.map(p =>
          p.id === projectId ? { ...p, isPaid: !p.isPaid } : p
        )
      );
    } catch (err) {
      console.error('Toggle paid failed:', err);
      throw err;
    }
  }, []);

  const fetchProjectAggregatedInventory = useCallback(async (projectId) => {
    try {
      const res = await api.get(
        `${ENDPOINTS.PROJECTS}/${projectId}/aggregated-inventory`
      );
      return res.data || [];
    } catch (err) {
      console.error('Failed to fetch project aggregated inventory', err);
      return [];
    }
  }, []);

  // ========== Initial Fetch ==========
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token !== 'mock-token') {
      fetchProjects();
    }
  }, [fetchProjects]);

  // ========== Context Value ==========
  const value = useMemo(
    () => ({
      projects,
      isLoading,
      fetchProjects,
      addProject,
      editProject,
      toggleProjectCompleted,
      toggleProjectPaid,
      fetchProjectAggregatedInventory,
      fetchProjectFinancials,
    }),
    [
      projects,
      isLoading,
      fetchProjects,
      addProject,
      editProject,
      toggleProjectCompleted,
      toggleProjectPaid,
      fetchProjectAggregatedInventory,
     
    ]
  );

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjects must be used within ProjectProvider');
  return ctx;
}