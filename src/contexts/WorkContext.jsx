import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import api from '../services/api';
import { ENDPOINTS } from '../services/endpoints';

const WorkContext = createContext(null);

export function WorkProvider({ children }) {
  const [installEntries, setInstallEntries] = useState([]);
  const [dismantleEntries, setDismantleEntries] = useState([]);
  const [deliveryEntries, setDeliveryEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ==================== Fetch All ====================
  const fetchAllWorkEntries = useCallback(async () => {
  setIsLoading(true);
  try {
    const [installRes, dismantleRes, deliveryRes] = await Promise.all([
      api.get(`${ENDPOINTS.WORK_ENTRIES}?type=Install`),
      api.get(`${ENDPOINTS.WORK_ENTRIES}?type=Dismantle`),
      api.get(`${ENDPOINTS.WORK_ENTRIES}?type=Delivery`),
    ]);
    setInstallEntries(installRes.data || []);
    setDismantleEntries(dismantleRes.data || []);
    setDeliveryEntries(deliveryRes.data || []);
  } catch (err) {
    console.warn('Failed to fetch work entries', err);
  } finally {
    setIsLoading(false);
  }
}, []);

  // ==================== Add Entry ====================
  const addInstallEntry = useCallback(async (entry) => {
    try {
      const res = await api.post(ENDPOINTS.WORK_ENTRY_INSTALL, entry);
      setInstallEntries(prev => [...prev, res.data]);
    } catch (err) {
      console.error('Failed to add install entry', err);
      throw err;
    }
  }, []);

  const addDismantleEntry = useCallback(async (entry) => {
    try {
      const res = await api.post(ENDPOINTS.WORK_ENTRY_DISMANTLE, entry);
      setDismantleEntries(prev => [...prev, res.data]);
    } catch (err) {
      console.error('Failed to add dismantle entry', err);
      throw err;
    }
  }, []);

  const addDeliveryEntry = useCallback(async (entry) => {
    try {
      const res = await api.post(ENDPOINTS.WORK_ENTRY_DELIVERY, entry);
      setDeliveryEntries(prev => [...prev, res.data]);
    } catch (err) {
      console.error('Failed to add delivery entry', err);
      throw err;
    }
  }, []);

  // ==================== Initial Fetch ====================
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token !== 'mock-token') {
      fetchAllWorkEntries();
    }
  }, [fetchAllWorkEntries]);

  // ==================== Context Value ====================
  const value = useMemo(() => ({
    installEntries,
    dismantleEntries,
    deliveryEntries,
    isLoading,
    fetchAllWorkEntries,
    addInstallEntry,
    addDismantleEntry,
    addDeliveryEntry,
  }), [installEntries, dismantleEntries, deliveryEntries, isLoading, fetchAllWorkEntries]);

  return (
    <WorkContext.Provider value={value}>
      {children}
    </WorkContext.Provider>
  );
}

export function useWork() {
  const ctx = useContext(WorkContext);
  if (!ctx) throw new Error('useWork must be used within WorkProvider');
  return ctx;
}