import axios from 'axios';
import {
  API_CONFIG,
  PaginationParams,
  PaginatedResponse,
  SoftwareItem,
  AuthCredentials,
  AuthResponse,
  CheckAuthResponse,
  BookmarkResponse,
  BookmarksResponse,
  BookmarkMessage,
  ApiError,
  HttpStatusCode,
  ApiException,
} from '../config/api';
import { Software, SoftwareListResponse, SoftwareSearchParams } from '../types/software';

type RequestConfig = {
  method: string;
  url: string;
  params?: any;
  data?: any;
  headers?: Record<string, string>;
};

export class ApiService {
  private api;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 添加請求攔截器
    this.api.interceptors.request.use(
      config => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  private async request<T>(config: RequestConfig): Promise<T> {
    try {
      const response = await this.api.request<T>(config);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          API_CONFIG.ERROR_MESSAGES[
            error.response.status as keyof typeof API_CONFIG.ERROR_MESSAGES
          ] || '未知錯誤'
        );
      }
      throw new Error('網路錯誤');
    }
  }

  // Auth endpoints
  async signup(credentials: {
    username: string;
    email: string;
    password: string;
  }): Promise<{ token: string; user: any }> {
    return this.request({
      method: 'POST',
      url: API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      data: credentials,
    });
  }

  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    return this.request({
      method: 'POST',
      url: API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      data: { email, password },
    });
  }

  async checkAuth(): Promise<CheckAuthResponse> {
    return this.request<CheckAuthResponse>({
      method: 'GET',
      url: API_CONFIG.ENDPOINTS.AUTH.PROFILE,
    });
  }

  // Bookmark endpoints
  async getBookmarks(): Promise<{ item_ids: string[] }> {
    return this.request({
      method: 'GET',
      url: API_CONFIG.ENDPOINTS.BOOKMARKS.LIST,
    });
  }

  async addBookmark(softwareId: string): Promise<BookmarkMessage> {
    return this.request<BookmarkMessage>({
      method: 'POST',
      url: API_CONFIG.ENDPOINTS.BOOKMARKS.ADD,
      data: { softwareId },
    });
  }

  async removeBookmark(softwareId: string): Promise<void> {
    return this.request<void>({
      method: 'DELETE',
      url: `${API_CONFIG.ENDPOINTS.BOOKMARKS.REMOVE}/${softwareId}`,
    });
  }

  async toggleBookmark(itemId: string): Promise<{ message: string }> {
    return this.request({
      method: 'POST',
      url: `${API_CONFIG.ENDPOINTS.BOOKMARKS.TOGGLE}/${itemId}`,
    });
  }

  // Software endpoints
  async getSoftwareList(params: SoftwareSearchParams): Promise<SoftwareListResponse> {
    return this.request({
      method: 'GET',
      url: API_CONFIG.ENDPOINTS.SOFTWARE.LIST,
      params,
    });
  }

  async getSoftwareDetail(id: string): Promise<Software> {
    return this.request({
      method: 'GET',
      url: `${API_CONFIG.ENDPOINTS.SOFTWARE.DETAIL}/${id}`,
    });
  }

  async createSoftware(data: Omit<SoftwareItem, 'id'>): Promise<SoftwareItem> {
    return this.request<SoftwareItem>({
      method: 'POST',
      url: API_CONFIG.ENDPOINTS.SOFTWARE.CREATE,
      data,
    });
  }

  async updateSoftware(id: string, data: Partial<SoftwareItem>): Promise<SoftwareItem> {
    return this.request<SoftwareItem>({
      method: 'PUT',
      url: `${API_CONFIG.ENDPOINTS.SOFTWARE.DETAIL}/${id}`,
      data,
    });
  }

  async deleteSoftware(id: string): Promise<void> {
    return this.request({
      method: 'DELETE',
      url: `${API_CONFIG.ENDPOINTS.SOFTWARE.DETAIL}/${id}`,
    });
  }
}

export const apiService = new ApiService();

const API_BASE_URL = 'http://localhost:3001/api';

interface SoftwareResponse {
  items: Software[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export const fetchSoftwareList = async (
  params: SoftwareSearchParams
): Promise<SoftwareResponse> => {
  const response = await axios.get<SoftwareResponse>(`${API_BASE_URL}/software`, { params });
  return response.data;
};
