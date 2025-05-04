import { create } from 'zustand';
import { Software, SoftwareSearchParams } from '../types/software';
import { apiService } from '../services/api';

interface SoftwareState {
  softwareList: Software[];
  favorites: Software[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  loadSoftwareList: (params?: SoftwareSearchParams) => Promise<void>;
  loadFavorites: () => Promise<void>;
  toggleFavorite: (softwareId: string) => Promise<void>;
  clearError: () => void;
  software: Software[];
  loadSoftware: (params: SoftwareSearchParams) => Promise<void>;
  toggleBookmark: (softwareId: string) => Promise<void>;
}

export const useSoftwareStore = create<SoftwareState>((set, get) => ({
  softwareList: [],
  favorites: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  hasMore: true,
  software: [],

  loadSoftwareList: async (params = { page: 1 }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getSoftwareList({
        page: params.page,
        search: params.query,
        categories: params.category ? [params.category] : undefined,
        sortBy: params.sortBy,
        sortDirection: params.sortOrder,
      });

      set(state => ({
        softwareList:
          params.page === 1 ? response.items : [...state.softwareList, ...response.items],
        currentPage: params.page || 1,
        hasMore: response.hasMore,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '載入開源軟體列表失敗',
        isLoading: false,
      });
    }
  },

  loadFavorites: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getBookmarks();
      set({
        favorites: response.item_ids.map(id => ({ id } as Software)),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '載入收藏失敗',
        isLoading: false,
      });
    }
  },

  toggleFavorite: async (softwareId: string) => {
    try {
      await apiService.toggleBookmark(softwareId);
      const favorites = get().favorites;
      const isFavorite = favorites.some(f => f.id === softwareId);

      set(state => ({
        favorites: isFavorite
          ? state.favorites.filter(f => f.id !== softwareId)
          : [...state.favorites, { id: softwareId } as Software],
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '操作失敗',
      });
    }
  },

  clearError: () => set({ error: null }),

  loadSoftware: async (params: SoftwareSearchParams) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiService.getSoftwareList({
        page: params.page,
        search: params.query,
        categories: params.category ? [params.category] : undefined,
        sortBy: params.sortBy,
        sortDirection: params.sortOrder,
      });
      set({
        software: response.items,
        hasMore: response.hasMore,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '載入軟體列表失敗',
        isLoading: false,
      });
    }
  },

  toggleBookmark: async (softwareId: string) => {
    try {
      await apiService.toggleBookmark(softwareId);
      const currentState = get();
      if (currentState.software.length > 0) {
        const params = {
          page: 1,
          limit: currentState.software.length,
        };
        await currentState.loadSoftware(params);
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '更新書籤失敗',
      });
    }
  },
}));
