import { create } from 'zustand';
import { User } from '@/types/api';
import { apiService } from '@/services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.login({ email, password });
      localStorage.setItem('token', response.data.token);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: '登入失敗，請檢查您的電子郵件和密碼',
        isLoading: false,
      });
    }
  },

  register: async (username: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.register({ username, email, password });
      localStorage.setItem('token', response.data.token);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: '註冊失敗，請稍後再試',
        isLoading: false,
      });
    }
  },

  logout: () => {
    apiService.logout();
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  clearError: () => set({ error: null }),
})); 