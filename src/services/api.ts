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
import { Software, SoftwareListResponse } from '../types/software';

class ApiService {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.token = localStorage.getItem('token');
  }

  private get headers() {
    return {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {})
    };
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          this.token = null;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new ApiException(
          response.status as HttpStatusCode,
          errorData.message || API_CONFIG.ERROR_MESSAGES[response.status as HttpStatusCode] || '請求失敗'
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }
      throw new ApiException(
        HttpStatusCode.InternalServerError,
        '網路錯誤'
      );
    }
  }

  // Auth endpoints
  async signup(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    this.token = response.token;
    localStorage.setItem('token', response.token);
    return response;
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const response = await this.request<{ token: string }>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.token = response.token;
    localStorage.setItem('token', response.token);
    return response;
  }

  async checkAuth(): Promise<CheckAuthResponse> {
    return this.request<CheckAuthResponse>(API_CONFIG.ENDPOINTS.AUTH.PROFILE, {
      method: 'GET'
    });
  }

  // Bookmark endpoints
  async getBookmarks(): Promise<BookmarkMessage[]> {
    return this.request<BookmarkMessage[]>(API_CONFIG.ENDPOINTS.BOOKMARKS.LIST, {
      method: 'GET'
    });
  }

  async addBookmark(softwareId: string): Promise<BookmarkMessage> {
    return this.request<BookmarkMessage>(API_CONFIG.ENDPOINTS.BOOKMARKS.ADD, {
      method: 'POST',
      body: JSON.stringify({ softwareId })
    });
  }

  async removeBookmark(softwareId: string): Promise<void> {
    return this.request<void>(`${API_CONFIG.ENDPOINTS.BOOKMARKS.REMOVE}/${softwareId}`, {
      method: 'DELETE'
    });
  }

  async toggleBookmark(softwareId: string): Promise<BookmarkMessage> {
    return this.request<BookmarkMessage>(API_CONFIG.ENDPOINTS.BOOKMARKS.TOGGLE, {
      method: 'POST',
      body: JSON.stringify({ softwareId })
    });
  }

  // Software endpoints
  async getSoftwareList(params: {
    page?: number;
    search?: string;
    categories?: string[];
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    startDate?: string;
    endDate?: string;
  }): Promise<SoftwareListResponse> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(item => queryParams.append(key, item));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });

    return this.request<SoftwareListResponse>(`${API_CONFIG.ENDPOINTS.SOFTWARE.LIST}?${queryParams.toString()}`, {
      method: 'GET'
    });
  }

  async getSoftwareDetail(name: string): Promise<Software> {
    return this.request<Software>(`${API_CONFIG.ENDPOINTS.SOFTWARE.DETAIL}/${name}`, {
      method: 'GET'
    });
  }

  async createSoftware(data: Omit<SoftwareItem, 'id'>): Promise<SoftwareItem> {
    return this.request<SoftwareItem>({
      method: 'POST',
      url: API_CONFIG.ENDPOINTS.SOFTWARE.CREATE,
      data
    });
  }

  async updateSoftware(id: string, data: Partial<SoftwareItem>): Promise<SoftwareItem> {
    return this.request<SoftwareItem>({
      method: 'PUT',
      url: API_CONFIG.ENDPOINTS.SOFTWARE.UPDATE(id),
      data
    });
  }

  async deleteSoftware(id: string): Promise<void> {
    return this.request<void>({
      method: 'DELETE',
      url: API_CONFIG.ENDPOINTS.SOFTWARE.DELETE(id)
    });
  }
}

export const apiService = new ApiService();
