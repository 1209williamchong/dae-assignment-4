import axios from 'axios';
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, AuthResponse, LoginCredentials, OpenSourceProject, PaginatedResponse, RegisterCredentials } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 添加請求攔截器
    this.api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // 添加響應攔截器
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // 認證相關
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(credentials: RegisterCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await this.api.post('/auth/register', credentials);
    return response.data;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
  }

  // 開源軟體相關
  async getSoftwareList(page: number = 1, pageSize: number = 10): Promise<ApiResponse<PaginatedResponse<OpenSourceProject>>> {
    const response = await this.api.get(`/software?page=${page}&pageSize=${pageSize}`);
    return response.data;
  }

  async getSoftwareById(id: string): Promise<ApiResponse<OpenSourceProject>> {
    const response = await this.api.get(`/software/${id}`);
    return response.data;
  }

  // 收藏相關
  async toggleFavorite(softwareId: string): Promise<ApiResponse<{ isFavorite: boolean }>> {
    const response = await this.api.post(`/software/${softwareId}/favorite`);
    return response.data;
  }

  async getFavorites(): Promise<ApiResponse<OpenSourceProject[]>> {
    const response = await this.api.get('/software/favorites');
    return response.data;
  }
}

export const apiService = new ApiService(); 