import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import api from '../services/api';
import { ENDPOINTS } from '../services/endpoints';

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLocations = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get(ENDPOINTS.LOCATIONS);
      // اطمینان از اینکه هر آیتم دارای serviceTypeName باشد
      const data = (res.data || []).map(loc => ({
        ...loc,
        serviceTypeName: loc.serviceTypeName || loc.serviceType || '', // fallback
      }));
      setLocations(data);
    } catch (err) {
      console.warn('Failed to fetch locations', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // تابع جدید: دریافت مکان‌های در دسترس (تحویل‌نشده)
  const fetchAvailableLocations = useCallback(async (projectId, serviceTypeName) => {
    setIsLoading(true);
    try {
      const res = await api.get(ENDPOINTS.LOCATIONS_AVAILABLE, {
        params: { projectId, serviceTypeName }
      });
      return res.data || [];
    } catch (err) {
      console.warn('Failed to fetch available locations', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addLocation = useCallback(async (projectId, serviceTypeName, title) => {
    try {
      const res = await api.post(ENDPOINTS.LOCATIONS, {
        projectId,
        serviceTypeName,
        title
      });
      const newLoc = { ...res.data, serviceTypeName };
      setLocations(prev => [...prev, newLoc]);
      return newLoc.id;
    } catch (err) {
      console.warn('Failed to add location', err);
      const fallback = { id: Date.now().toString(), projectId, serviceTypeName, title };
      setLocations(prev => [...prev, fallback]);
      return fallback.id;
    }
  }, []);

  const editLocation = useCallback(async (id, newTitle) => {
    try {
      await api.put(`${ENDPOINTS.LOCATIONS}/${id}`, { newTitle });
      setLocations(prev => prev.map(loc => loc.id === id ? { ...loc, title: newTitle } : loc));
    } catch (err) {
      console.warn('Failed to edit location', err);
    }
  }, []);

  const removeLocation = useCallback(async (id) => {
    try {
      await api.delete(`${ENDPOINTS.LOCATIONS}/${id}`);
      setLocations(prev => prev.filter(loc => loc.id !== id));
    } catch (err) {
      console.warn('Failed to delete location', err);
    }
  }, []);

  const getLocations = useCallback((projectId, serviceTypeName) => {
    return (locations || []).filter(
      loc =>
        loc.projectId === projectId &&
        (loc.serviceTypeName === serviceTypeName || loc.serviceType === serviceTypeName)
    );
  }, [locations]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token !== 'mock-token') {
      fetchLocations();
    }
  }, [fetchLocations]);

  const value = useMemo(() => ({
    locations: locations || [],
    isLoading,
    fetchLocations,
      fetchAvailableLocations,
    addLocation,
    editLocation,
    removeLocation,
    getLocations,
  }), [locations, isLoading, fetchLocations, addLocation, editLocation, removeLocation, getLocations]);

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocations() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocations must be used within LocationProvider');
  return ctx;
}