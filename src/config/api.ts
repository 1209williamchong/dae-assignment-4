export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface SoftwareItem {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  videoUrl: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user_id: number;
  token: string;
}

export interface CheckAuthResponse {
  user_id: number | null;
}

export type BookmarkMessage =
  | 'newly bookmarked'
  | 'already bookmarked'
  | 'newly deleted'
  | 'already deleted';

export interface BookmarkResponse {
  message: BookmarkMessage;
}

export interface BookmarksResponse {
  item_ids: number[];
}

export const API_CONFIG = {
  BASE_URL: 'https://dae-mobile-assignment.hkit.cc/api',
  ENDPOINTS: {
    AUTH: {
      SIGNUP: '/auth/signup',
      LOGIN: '/auth/login',
      CHECK: '/auth/check',
    },
    BOOKMARKS: {
      LIST: '/bookmarks',
      TOGGLE: (itemId: number) => `/bookmarks/${itemId}`,
    },
    SOFTWARE: {
      LIST: '/software',
      DETAIL: (id: string) => `/software/${id}`,
      CREATE: '/software',
      UPDATE: (id: string) => `/software/${id}`,
      DELETE: (id: string) => `/software/${id}`,
    },
  },
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  DEFAULT_PAGINATION: {
    page: 1,
    limit: 3,
    maxLimit: 5,
  },
};

import BookmarkList from './components/BookmarkList';

// 在您的頁面中使用
<BookmarkList />
