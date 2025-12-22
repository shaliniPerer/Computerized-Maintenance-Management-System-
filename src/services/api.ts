import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { API_CONFIG } from '../config/apiConfig';

console.log('API BASE URL from config:', API_CONFIG.BASE_URL);

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.HEADERS,
    });

    console.log(
      'Axios instance created with baseURL:',
      this.axiosInstance.defaults.baseURL
    );

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');

        // ✅ Safe logging (TypeScript-friendly)
        const baseURL = config.baseURL ?? '';
        const url = config.url ?? '';
        const method = config.method?.toUpperCase() ?? 'UNKNOWN';

        console.log(`➡️ API REQUEST [${method}] ${baseURL}${url}`);

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        console.error(' REQUEST ERROR:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors globally
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(
          `API RESPONSE [${response.status}] ${response.config.url}`
        );
        return response;
      },
      (error: AxiosError) => {
        console.error(
          ' API RESPONSE ERROR:',
          error.config?.url,
          error.response?.status
        );

        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(
      url,
      data,
      config
    );
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(
      url,
      data,
      config
    );
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.patch(
      url,
      data,
      config
    );
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(
      url,
      config
    );
    return response.data;
  }

  // File upload
  async uploadFile<T>(
    url: string,
    file: File,
    fieldName: string = 'file'
  ): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);

    const response: AxiosResponse<T> =
      await this.axiosInstance.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

    return response.data;
  }
}

export const api = new ApiService();
