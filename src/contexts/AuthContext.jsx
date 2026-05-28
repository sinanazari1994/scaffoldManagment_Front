import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';
import { ENDPOINTS } from '../services/endpoints';
import { ROLES } from '../lib/constants';

const AuthContext = createContext(null);

const MOCK_USERS = [
  { username: 'worker1', password: '1111', role: ROLES.WORKER, fullName: 'حسن کارگر' },
  { username: 'worker2', password: '2222', role: ROLES.WORKER, fullName: 'علی کارگر' },
  { username: 'manager', password: '3333', role: ROLES.OFFICE_MANAGER, fullName: 'مدیر دفتر' },
  { username: 'admin',   password: '4444', role: ROLES.CONTRACTOR, fullName: 'پیمانکار اصلی' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (username, password) => {
    try {
      const res = await api.post(ENDPOINTS.AUTH.LOGIN, { username, password });
      const { token, user: userData } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      // Fallback to Mock
      console.warn('API login failed, using mock data', err);
      const found = MOCK_USERS.find(u => u.username === username && u.password === password);
      if (found) {
        const userData = { ...found };
        delete userData.password;
        localStorage.setItem('token', 'mock-token');
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: 'نام کاربری یا رمز عبور اشتباه است' };
    }
  }, []);

 const logout = useCallback(() => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setUser(null);
}, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth باید داخل AuthProvider استفاده شود');
  return context;
}