import { create } from 'zustand';
import { Software, SoftwareSearchParams } from '../types/types';
import { fetchSoftwareList } from '../services/api';

interface ProjectState {
  software: Software[];
  loading: boolean;
  error: string | null;
  searchParams: SoftwareSearchParams;
  setSearchParams: (params: Partial<SoftwareSearchParams>) => void;
  fetchSoftware: () => Promise<void>;
}

const useProjectStore = create<ProjectState>((set, get) => ({
  software: [],
  loading: false,
  error: null,
  searchParams: {
    page: 1,
    limit: 10,
    search: '',
    category: '',
    sort: 'title',
    order: 'asc',
  },

  setSearchParams: params => {
    set(state => ({
      searchParams: {
        ...state.searchParams,
        ...params,
        page: params.page || 1,
      },
    }));
  },

  fetchSoftware: async () => {
    set({ loading: true, error: null });
    try {
      const { searchParams } = get();
      const response = await fetchSoftwareList(searchParams);
      set({ software: response.items, loading: false });
    } catch (error) {
      set({ error: '載入軟體列表失敗', loading: false });
    }
  },
}));

export default useProjectStore;
