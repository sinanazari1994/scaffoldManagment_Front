import { useEffect } from 'react';
import { useData } from '../contexts/DataContext';

export function useApiInitializer() {
  const { fetchProjects, fetchWarehouses, fetchWorkers } = useData();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token !== 'mock-token') {
      fetchProjects();
      fetchWarehouses();
      fetchWorkers();
    }
  }, []);
}