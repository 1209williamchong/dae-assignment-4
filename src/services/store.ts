import { env } from '../utils/env';
import { logger } from './logger';
import { notification } from './notification';
import { User } from '../types/api';
import { create } from 'zustand';
import { apiService } from './api';

// 存儲鍵
const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  SETTINGS: 'settings',
} as const;

// 存儲服務類
class StoreService {
  private token: string | null;
  private user: User | null;
  private settings: Record<string, any>;

  constructor() {
    this.token = null;
    this.user = null;
    this.settings = {};

    this.init();
  }

  // 初始化存儲
  private init(): void {
    // 從本地存儲加載數據
    this.token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    this.user = userJson ? JSON.parse(userJson) : null;
    const settingsJson = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    this.settings = settingsJson ? JSON.parse(settingsJson) : {};

    logger.info('存儲服務已初始化', {
      hasToken: !!this.token,
      hasUser: !!this.user,
      settings: this.settings,
    });
  }

  // 設置令牌
  setToken(token: string | null): void {
    this.token = token;
    if (token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
    logger.info('令牌已更新', { hasToken: !!token });
  }

  // 獲取令牌
  getToken(): string | null {
    return this.token;
  }

  // 設置用戶
  setUser(user: User | null): void {
    this.user = user;
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    logger.info('用戶已更新', { user });
  }

  // 獲取用戶
  getUser(): User | null {
    return this.user;
  }

  // 設置設置
  setSettings(settings: Record<string, any>): void {
    this.settings = settings;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    logger.info('設置已更新', { settings });
  }

  // 獲取設置
  getSettings(): Record<string, any> {
    return this.settings;
  }

  // 更新設置
  updateSettings(key: string, value: any): void {
    this.settings[key] = value;
    this.setSettings(this.settings);
  }

  // 清除存儲
  clear(): void {
    this.token = null;
    this.user = null;
    this.settings = {};

    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);

    logger.info('存儲已清除');
  }

  // 檢查是否已登入
  isLoggedIn(): boolean {
    return !!this.token && !!this.user;
  }

  // 登出
  logout(): void {
    this.clear();
    notification.show('已登出', { type: 'success' });
  }
}

// 導出單例實例
export const store = new StoreService();

interface StoreState {
  isLoading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStore = create<StoreState>(set => ({
  isLoading: false,
  error: null,
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
}));
