import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import api from '../services/api';
import { ENDPOINTS } from '../services/endpoints';

const PaymentContext = createContext(null);

export function PaymentProvider({ children }) {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get(ENDPOINTS.PAYMENTS);
      setPayments(res.data);
    } catch (err) {
      console.warn('Failed to fetch payments, using empty list', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addPayment = useCallback(async (projectId, amount, date, note) => {
    try {
      const res = await api.post(ENDPOINTS.PAYMENTS, { projectId, amount, date, note });
      setPayments(prev => [...prev, res.data]);
    } catch (err) {
      console.warn('Failed to add payment', err);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token !== 'mock-token') {
      fetchPayments();
    }
  }, [fetchPayments]);

  const value = useMemo(() => ({
    payments,
    isLoading,
    fetchPayments,
    addPayment,
  }), [payments, isLoading, fetchPayments, addPayment]);

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayments() {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error('usePayments must be used within PaymentProvider');
  return ctx;
}