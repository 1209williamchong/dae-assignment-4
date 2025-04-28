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

export enum HttpStatusCode {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500
}

export const API_CONFIG = {
  BASE_URL: 'https://dae-mobile-assignment.hkit.cc/api',
  VERSION: 'v1',
  ENDPOINTS: {
    SOFTWARE: {
      LIST: '/api/software',
      DETAIL: '/api/software/:id',
      CREATE: '/api/software',
      UPDATE: '/api/software/:id',
      DELETE: '/api/software/:id',
      SEARCH: '/api/software/search',
      CATEGORIES: '/api/software/categories',
      STATS: '/api/software/stats',
      POPULAR: '/api/software/popular',
      RECENT: '/api/software/recent',
      RECOMMEND: '/api/software/recommend',
      LIKE: '/api/software/:id/like',
      UNLIKE: '/api/software/:id/unlike',
      SHARE: '/api/software/:id/share',
      DOWNLOAD: '/api/software/:id/download',
      VERSIONS: '/api/software/:id/versions',
      LATEST_VERSION: '/api/software/:id/versions/latest',
      DEPENDENCIES: '/api/software/:id/dependencies',
      DEPENDENTS: '/api/software/:id/dependents',
    },
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      PROFILE: '/auth/profile',
      REFRESH: '/auth/refresh',
      SIGNUP: '/auth/signup',
      CHECK: '/auth/check'
    },
    BOOKMARKS: {
      LIST: '/bookmarks',
      ADD: '/bookmarks/:item_id',
      REMOVE: '/bookmarks/:item_id',
      TOGGLE: '/bookmarks/toggle'
    },
    COMMENTS: {
      LIST: '/software/:id/comments',
      CREATE: '/software/:id/comments',
      UPDATE: '/comments/:id',
      DELETE: '/comments/:id'
    },
    RESOURCE: {
      LIST: '/{resource}',
    },
  },
  STATUS_CODES: {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  },
  ERROR_MESSAGES: {
    [400]: '請求格式錯誤',
    [401]: '未授權訪問',
    [403]: '禁止訪問',
    [404]: '資源不存在',
    [500]: '伺服器錯誤'
  },
};

import BookmarkList from './components/BookmarkList';

// 在您的頁面中使用
<BookmarkList />

export interface ApiError {
  error: string;
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

export interface Software {
  id: string;
  name: string;
  description: string;
  category: string;
  license: string;
  version: string;
  author: string;
  repository: string;
  website: string;
  stars: number;
  forks: number;
  downloads: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  dependencies: string[];
  screenshots: string[];
  documentation: string;
  isOpenSource: boolean;
  isVerified: boolean;
}

export interface SoftwareVersion {
  version: string;
  releaseDate: string;
  changelog: string;
  downloadUrl: string;
  size: number;
  checksum: string;
}

export interface SoftwareStats {
  totalDownloads: number;
  monthlyDownloads: number;
  weeklyDownloads: number;
  dailyDownloads: number;
  totalStars: number;
  totalForks: number;
  activeContributors: number;
  lastUpdated: string;
}

export interface SoftwareSearchParams {
  query?: string;
  category?: string;
  license?: string;
  minStars?: number;
  minDownloads?: number;
  isOpenSource?: boolean;
  isVerified?: boolean;
  sortBy?: 'stars' | 'downloads' | 'updated' | 'created';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ResourceItem {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  videoUrl: string;
}

export interface AuthCheckResponse {
  user_id: number | null;
}

export interface ErrorResponse {
  error: string;
}
