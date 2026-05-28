import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import api from '../services/api';
import { ENDPOINTS } from '../services/endpoints';
import { ROLES } from '../lib/constants';

const DataContext = createContext(null);

const MOCK_WORKERS = [
  { id: 'u1', fullName: 'حسن کارگر', phone: '09120000001', role: ROLES.WORKER, username: 'worker1' },
  { id: 'u2', fullName: 'علی کارگر', phone: '09120000002', role: ROLES.WORKER, username: 'worker2' },
  { id: 'u3', fullName: 'محمد کارگر', phone: '09120000003', role: ROLES.WORKER, username: 'worker3' },
];

export function DataProvider({ children }) {
  const [workers, setWorkers] = useState(MOCK_WORKERS);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

const addWorker = useCallback(async (workerData) => {
  try {
    const res = await api.post(ENDPOINTS.USERS, workerData);
    setWorkers(prev => [...prev, res.data]);
  } catch (err) {
    console.error('Failed to add worker', err);
    throw err;
  }
}, []);

  const fetchWorkers = useCallback(async () => {
    try {
      const res = await api.get(ENDPOINTS.USERS);
      setWorkers(res.data);
    } catch (err) {
      console.warn('Failed to fetch workers, using mock data', err);
    }
  }, []);

  const sellItem = useCallback(async (warehouseId, equipment, quantity, price, projectId) => {
    try {
      await api.post(ENDPOINTS.WAREHOUSE_SELL(warehouseId), { equipment, quantity, price, projectId });
    } catch (err) {
      console.warn('Failed to sell item', err);
    }
  }, []);

  const scrapItem = useCallback(async (warehouseId, equipment, quantity) => {
    try {
      await api.post(ENDPOINTS.WAREHOUSE_SCRAP(warehouseId), { equipment, quantity });
    } catch (err) {
      console.warn('Failed to scrap item', err);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token !== 'mock-token') {
      fetchWorkers();
    }
  }, [fetchWorkers]);

  const value = useMemo(() => ({
    workers,
    transactions,
    isLoading,
    sellItem,
    scrapItem,
    fetchWorkers,
    addWorker,
  }), [workers,addWorker, transactions, isLoading, sellItem, scrapItem, fetchWorkers]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}