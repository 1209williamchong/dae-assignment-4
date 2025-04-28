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
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.defaultHeaders = API_CONFIG.DEFAULT_HEADERS;
    this.token = localStorage.getItem('token');
  }

  private getAuthHeaders(): Record<string, string> {
    return this.token
      ? { ...this.defaultHeaders, Authorization: `Bearer ${this.token}` }
      : this.defaultHeaders;
  }

  private buildQueryString(params: Record<string, any>): string {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    return queryParams.toString() ? `?${queryParams.toString()}` : '';
  }

  private async handleError(response: Response): Promise<never> {
    const status = response.status as HttpStatusCode;
    let errorMessage = API_CONFIG.ERROR_MESSAGES[status] || '未知錯誤';

    try {
      const errorData: ApiError = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      // 如果無法解析 JSON，使用默認錯誤消息
    }

    if (status === HttpStatusCode.Unauthorized) {
      this.token = null;
      localStorage.removeItem('token');
    }

    throw new ApiException(status, errorMessage);
  }

  private async request<T>(
    endpoint: string,
    method: string = 'GET',
    data?: any,
    requiresAuth: boolean = false
  ): Promise<T> {
    const headers = requiresAuth ? this.getAuthHeaders() : this.defaultHeaders;

    const options: RequestInit = {
      method,
      headers,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, options);

      if (!response.ok) {
        return this.handleError(response);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }
      console.error('API request failed:', error);
      throw new ApiException(HttpStatusCode.InternalServerError, '請求失敗，請稍後再試');
    }
  }

  // Auth endpoints
  async signup(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.SIGNUP,
      'POST',
      credentials
    );
    this.token = response.token;
    localStorage.setItem('token', response.token);
    return response;
  }

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      'POST',
      credentials
    );
    this.token = response.token;
    localStorage.setItem('token', response.token);
    return response;
  }

  async checkAuth(): Promise<CheckAuthResponse> {
    return this.request<CheckAuthResponse>(API_CONFIG.ENDPOINTS.AUTH.CHECK, 'GET', undefined, true);
  }

  // Bookmark endpoints
  async getBookmarks(): Promise<BookmarksResponse> {
    return this.request<BookmarksResponse>(
      API_CONFIG.ENDPOINTS.BOOKMARKS.LIST,
      'GET',
      undefined,
      true
    );
  }

  async addBookmark(itemId: number): Promise<BookmarkResponse> {
    return this.request<BookmarkResponse>(
      API_CONFIG.ENDPOINTS.BOOKMARKS.TOGGLE(itemId),
      'POST',
      undefined,
      true
    );
  }

  async removeBookmark(itemId: number): Promise<BookmarkResponse> {
    return this.request<BookmarkResponse>(
      API_CONFIG.ENDPOINTS.BOOKMARKS.TOGGLE(itemId),
      'DELETE',
      undefined,
      true
    );
  }

  async toggleBookmark(itemId: number): Promise<BookmarkResponse> {
    const bookmarks = await this.getBookmarks();
    const isBookmarked = bookmarks.item_ids.includes(itemId);

    if (isBookmarked) {
      return this.removeBookmark(itemId);
    } else {
      return this.addBookmark(itemId);
    }
  }

  // Software endpoints
  async getSoftwareList(params: {
    page?: number;
    search?: string;
    categories?: string[];
    sortBy?: string;
    sortDirection?: boolean;
    startDate?: string;
    endDate?: string;
  }): Promise<SoftwareListResponse> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.categories?.length) queryParams.append('categories', params.categories.join(','));
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection !== undefined) queryParams.append('sortDirection', params.sortDirection.toString());
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    return this.request<SoftwareListResponse>(
      `${API_CONFIG.ENDPOINTS.SOFTWARE.LIST}?${queryParams.toString()}`,
      'GET'
    );
  }

  async getSoftwareDetail(name: string): Promise<Software> {
    return this.request<Software>(
      API_CONFIG.ENDPOINTS.SOFTWARE.DETAIL(name),
      'GET'
    );
  }

  async createSoftware(data: Omit<SoftwareItem, 'id'>): Promise<SoftwareItem> {
    return this.request(API_CONFIG.ENDPOINTS.SOFTWARE.CREATE, 'POST', data, true);
  }

  async updateSoftware(id: string, data: Partial<SoftwareItem>): Promise<SoftwareItem> {
    return this.request(API_CONFIG.ENDPOINTS.SOFTWARE.UPDATE(id), 'PUT', data, true);
  }

  async deleteSoftware(id: string): Promise<void> {
    return this.request(API_CONFIG.ENDPOINTS.SOFTWARE.DELETE(id), 'DELETE', undefined, true);
  }

  async toggleBookmark(name: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/software/${name}/bookmark`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('書籤操作失敗');
    }
  }
}

export const apiService = new ApiService();
