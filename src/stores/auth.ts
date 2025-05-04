import { create } from 'zustand';
import { apiService } from '../services/api';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (credentials: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  isAuthenticated: false,
  user: null,

  login: async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);
      localStorage.setItem('token', response.token);
      set({
        isAuthenticated: true,
        user: response.user,
      });
    } catch (error) {
      throw error;
    }
  },

  signup: async (credentials: { username: string; email: string; password: string }) => {
    try {
      const response = await apiService.signup(credentials);
      localStorage.setItem('token', response.token);
      set({
        isAuthenticated: true,
        user: response.user,
      });
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      isAuthenticated: false,
      user: null,
    });
  },
}));
