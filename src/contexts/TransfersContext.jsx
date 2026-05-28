import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import api from '../services/api';
import { ENDPOINTS } from '../services/endpoints';

const TransfersContext = createContext(null);

export function TransfersProvider({ children }) {
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [transferHistory, setTransferHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ==================== Fetch ====================
  const fetchPendingTransfers = useCallback(async () => {
    try {
      const res = await api.get(ENDPOINTS.TRANSFERS_PENDING);
      setPendingTransfers(res.data || []);
    } catch (err) {
      console.warn('Failed to fetch pending transfers', err);
      setPendingTransfers([]);
    }
  }, []);

  const fetchTransferHistory = useCallback(async () => {
    try {
      const res = await api.get(ENDPOINTS.TRANSFER_HISTORY);
      setTransferHistory(res.data || []);
    } catch (err) {
      console.warn('Failed to fetch transfer history', err);
      setTransferHistory([]);
    }
  }, []);

  // ==================== Mutate ====================
  const createOutgoingTransfer = useCallback(async (warehouseId, items, userId) => {
    const payload = {
      sourceType: 'warehouse',
      sourceId: warehouseId,
      items: items.map(i => ({ equipmentName: i.name, quantity: i.quantity })),
      userId
    };
    await api.post(ENDPOINTS.TRANSFERS_OUTGOING, payload);
    await fetchPendingTransfers();
  }, [fetchPendingTransfers]);

  const createProjectToPendingTransfer = useCallback(async (projectId, items, userId) => {
    const payload = {
      sourceType: 'project',
      sourceId: projectId,
      items: items.map(i => ({ equipmentName: i.name, quantity: i.quantity })),
      userId
    };
    await api.post(ENDPOINTS.TRANSFERS_OUTGOING, payload);
    await fetchPendingTransfers();
  }, [fetchPendingTransfers]);

  const resolvePendingTransfer = useCallback(async (transferId, targetType, targetId, userId, items = null) => {
    const payload = { targetType, targetId, userId };
    if (items && items.length > 0) {
      payload.items = items.map(i => ({ equipmentName: i.name, quantity: i.quantity }));
    }
    await api.post(ENDPOINTS.TRANSFER_RESOLVE(transferId), payload);
    await fetchPendingTransfers();
    await fetchTransferHistory();
  }, [fetchPendingTransfers, fetchTransferHistory]);

  // ==================== تابع جدید ====================
  const resolveItemsFromPending = useCallback(async (targetType, targetId, userId, items) => {
    const payload = {
      targetType,
      targetId,
      userId,
      items: items.map(i => ({ equipmentName: i.name, quantity: i.quantity }))
    };
    await api.post(ENDPOINTS.TRANSFER_RESOLVE_ITEMS, payload);
    await fetchPendingTransfers();
    await fetchTransferHistory();
  }, [fetchPendingTransfers, fetchTransferHistory]);

  // ==================== واکشی اولیه ====================
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token !== 'mock-token') {
      setIsLoading(true);
      Promise.all([fetchPendingTransfers(), fetchTransferHistory()])
        .finally(() => setIsLoading(false));
    }
  }, [fetchPendingTransfers, fetchTransferHistory]);

  const value = useMemo(() => ({
    pendingTransfers,
    transferHistory,
    isLoading,
    fetchPendingTransfers,
    fetchTransferHistory,
    createOutgoingTransfer,
    createProjectToPendingTransfer,
    resolvePendingTransfer,
    resolveItemsFromPending,   // <-- حتماً این خط باشد
  }), [pendingTransfers, transferHistory, isLoading,
      fetchPendingTransfers, fetchTransferHistory,
      createOutgoingTransfer, createProjectToPendingTransfer,
      resolvePendingTransfer, resolveItemsFromPending]);

  return (
    <TransfersContext.Provider value={value}>
      {children}
    </TransfersContext.Provider>
  );
}

export function useTransfers() {
  const ctx = useContext(TransfersContext);
  if (!ctx) throw new Error('useTransfers must be used within TransfersProvider');
  return ctx;
}