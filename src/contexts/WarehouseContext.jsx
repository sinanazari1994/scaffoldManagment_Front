import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import api from '../services/api';
import { ENDPOINTS } from '../services/endpoints';

const WarehouseContext = createContext(null);

export function WarehouseProvider({ children }) {
  const [warehouses, setWarehouses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWarehouses = useCallback(async () => {
  try {
    const res = await api.get(ENDPOINTS.WAREHOUSES);
    const data = res.data || [];
    setWarehouses(data);
    return data;   // <-- برگرداندن داده
  } catch (err) {
    console.error('Failed to fetch warehouses', err);
    setWarehouses([]);
    return [];
  }
}, []);

 const fetchAggregatedInventory = useCallback(async (warehouseId) => {
  try {
    const res = await api.get(`${ENDPOINTS.WAREHOUSES}/${warehouseId}/aggregated-inventory`);
    return res.data || [];
  } catch (err) {
    console.error('Failed to fetch aggregated inventory', err);
    return [];
  }
}, []);

  const addWarehouse = useCallback(async (name) => {
  try {
    const res = await api.post(ENDPOINTS.WAREHOUSES, { name });
    setWarehouses(prev => [...prev, res.data]);
  } catch (err) {
    const message = err.response?.data?.message || '';
    if (message.startsWith('PLAN_LIMIT_REACHED')) {
      const reason = message.split(':')[1] || 'warehouses';
      window.location.href = `/plan-limit?reason=${reason}`;
      return;
    }
    throw err;
  }
}, []);

  const addEquipmentToWarehouse = useCallback(async (warehouseId, equipmentName, quantity) => {
    try {
      await api.post(ENDPOINTS.WAREHOUSE_ITEMS(warehouseId), { equipmentName, quantity });
      await fetchWarehouses(); // بازواکشی کل لیست
    } catch (err) {
      throw err;
    }
  }, [fetchWarehouses]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token !== 'mock-token') {
      fetchWarehouses();
    }
  }, [fetchWarehouses]);

  const value = useMemo(() => ({
    warehouses: Array.isArray(warehouses) ? warehouses : [],
    isLoading,
    fetchWarehouses,
    addWarehouse,
    addEquipmentToWarehouse,
    fetchAggregatedInventory,   // <-- متد جدید
  }), [warehouses, isLoading, fetchWarehouses, addWarehouse, addEquipmentToWarehouse, fetchAggregatedInventory]);

  return (
    <WarehouseContext.Provider value={value}>
      {children}
    </WarehouseContext.Provider>
  );
}

export function useWarehouses() {
  const ctx = useContext(WarehouseContext);
  if (!ctx) throw new Error('useWarehouses must be used within WarehouseProvider');
  return ctx;
}