import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType } from '../types/types';

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  error: null,
  isLoading: false,
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setUser({ id: 1 }); // 模擬用戶資料
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      // 模擬登入
      const token = 'mock-token';
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      setUser({ id: 1 });
    } catch (err) {
      setError('登入失敗');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, error, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
