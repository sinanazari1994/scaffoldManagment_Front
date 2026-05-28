import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import api from '../services/api';
import { ENDPOINTS } from '../services/endpoints';

const ServiceContext = createContext(null);

export function ServiceProvider({ children }) {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get(ENDPOINTS.SERVICES);
      // نگاشت داده به فرمت مورد نیاز (هر سرویس حداقل id و name دارد)
      setServices(res.data.map(s => ({ id: s.id, name: s.name })));
    } catch (err) {
      console.warn('Failed to fetch services', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addService = useCallback(async (name) => {
  try {
    const res = await api.post(ENDPOINTS.SERVICES, { name });
    const newService = res.data; // { id, name }
    setServices(prev => [...prev, newService]);
    return newService;   // <-- برگرداندن شیء کامل
  } catch (err) {
    console.warn('Failed to add service', err);
    throw err;
  }
}, []);

  const removeService = useCallback(async (id) => {
    try {
      await api.delete(`${ENDPOINTS.SERVICES}/${id}`);
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.warn('Failed to delete service', err);
    }
  }, []);

  const editService = useCallback(async (id, newName) => {
  try {
    await api.put(`${ENDPOINTS.SERVICES}/${id}`, { name: newName });
    setServices(prev => prev.map(s => (s.id === id ? { ...s, name: newName } : s)));
  } catch (err) {
    console.warn('Failed to edit service', err);
  }
}, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token !== 'mock-token') {
      fetchServices();
    }
  }, [fetchServices]);

  const value = useMemo(() => ({
    services,
    isLoading,
    fetchServices,
    addService,
    removeService,
    editService,
  }), [services, isLoading, fetchServices, addService, removeService, editService]);

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices() {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error('useServices must be used within ServiceProvider');
  return ctx;
}