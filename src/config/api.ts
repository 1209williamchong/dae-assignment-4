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
    SOFTWARE: {
      LIST: '/software',
      DETAIL: (name: string) => `/software/${name}`,
    },
    AUTH: {
      SIGNUP: '/auth/signup',
      LOGIN: '/auth/login',
      CHECK: '/auth/check',
    },
    BOOKMARKS: {
      LIST: '/bookmarks',
      TOGGLE: (itemId: number) => `/bookmarks/${itemId}`,
    },
  },
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  ERROR_MESSAGES: {
    400: '無效的請求',
    401: '未授權',
    403: '禁止訪問',
    404: '找不到資源',
    500: '伺服器錯誤',
  },
};

import BookmarkList from './components/BookmarkList';

// 在您的頁面中使用
<BookmarkList />

export interface ApiError {
  error: string;
}

export enum HttpStatusCode {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
}

export class ApiException extends Error {
  constructor(
    public status: HttpStatusCode,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiException';
  }
}
