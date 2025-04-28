import { create } from 'zustand';
import { OpenSourceProject } from '@/types/api';
import { apiService } from '@/services/api';

interface SoftwareState {
  softwareList: OpenSourceProject[];
  favorites: OpenSourceProject[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  loadSoftwareList: (page?: number) => Promise<void>;
  loadFavorites: () => Promise<void>;
  toggleFavorite: (softwareId: string) => Promise<void>;
  clearError: () => void;
}

export const useSoftwareStore = create<SoftwareState>((set, get) => ({
  softwareList: [],
  favorites: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  hasMore: true,

  loadSoftwareList: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getSoftwareList(page);
      const newSoftware = response.data.items;
      set((state) => ({
        softwareList: page === 1 ? newSoftware : [...state.softwareList, ...newSoftware],
        currentPage: page,
        hasMore: response.data.hasMore,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: '載入開源軟體列表失敗，請稍後再試',
        isLoading: false,
      });
    }
  },

  loadFavorites: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getFavorites();
      set({
        favorites: response.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: '載入收藏失敗，請稍後再試',
        isLoading: false,
      });
    }
  },

  toggleFavorite: async (softwareId: string) => {
    try {
      const response = await apiService.toggleFavorite(softwareId);
      if (response.data.isFavorite) {
        const software = get().softwareList.find((s) => s.id === softwareId);
        if (software) {
          set((state) => ({
            favorites: [...state.favorites, software],
          }));
        }
      } else {
        set((state) => ({
          favorites: state.favorites.filter((s) => s.id !== softwareId),
        }));
      }
    } catch (error) {
      set({
        error: '操作失敗，請稍後再試',
      });
    }
  },

  clearError: () => set({ error: null }),
})); 