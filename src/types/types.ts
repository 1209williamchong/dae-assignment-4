export interface Software {
  id: number;
  name: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  videoUrl: string;
  icon: string;
  video: string;
  version: string;
  license: string;
  tags: string[];
  date: string;
}

export interface SoftwareSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  error: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface CheckAuthResponse {
  user: any;
  token?: string;
}
