import { create } from 'zustand';
import { apiService } from '../services/api';
import { AuthCredentials, CheckAuthResponse } from '../config/api';

interface AuthState {
  userId: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signup: (credentials: AuthCredentials) => Promise<void>;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
  userId: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  signup: async credentials => {
    set({ isLoading: true, error: null });
    try {
      await apiService.signup(credentials);
      set({ isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '註冊失敗', isLoading: false });
    }
  },

  login: async credentials => {
    set({ isLoading: true, error: null });
    try {
      await apiService.login(credentials);
      set({ isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '登入失敗', isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ userId: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await apiService.checkAuth();
      set({
        userId: response.user_id,
        isAuthenticated: response.user_id !== null,
        isLoading: false,
      });
    } catch (error) {
      set({ isAuthenticated: false, isLoading: false });
    }
  },
}));
