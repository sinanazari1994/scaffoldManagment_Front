import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import api from '../services/api';
import { ENDPOINTS } from '../services/endpoints';

const EquipmentTypeContext = createContext(null);

export function EquipmentTypeProvider({ children }) {
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get(ENDPOINTS.EQUIPMENT_TYPES);
      setEquipmentTypes(res.data || []);
    } catch (err) {
      console.warn('Failed to fetch equipment types', err);
      setEquipmentTypes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ⭐ تابع جدید
 const addEquipmentType = useCallback(async (name) => {
  try {
    const res = await api.post(ENDPOINTS.EQUIPMENT_TYPES, { name });
    // بک‌اند فقط GUID برمی‌گرداند، ما خودمان شیء کامل را می‌سازیم
    const id = res.data;          // مثلاً "e8577b8e-..."
    const newType = { id, name };
    setEquipmentTypes(prev => [...prev, newType]);
    return newType;
  } catch (err) {
    console.error('Failed to add equipment type', err);
    throw err;
  }
}, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token !== 'mock-token') {
      fetchAll();
    }
  }, [fetchAll]);

  const value = useMemo(() => ({
    equipmentTypes,
    isLoading,
    fetchAll,
    addEquipmentType,   // <-- export شود
  }), [equipmentTypes, isLoading, fetchAll, addEquipmentType]);

  return (
    <EquipmentTypeContext.Provider value={value}>
      {children}
    </EquipmentTypeContext.Provider>
  );
}

export function useEquipmentTypes() {
  const ctx = useContext(EquipmentTypeContext);
  if (!ctx) throw new Error('useEquipmentTypes must be used within EquipmentTypeProvider');
  return ctx;
}