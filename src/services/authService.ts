import { api } from './api';
import { ENDPOINTS } from '../config/apiConfig';
import { User, LoginCredentials } from '../types';

interface AuthResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
    token: string;
  };
}

interface RegisterData extends LoginCredentials {
  name: string;
  role?: string;
  phone?: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
    
    if (response.success && response.data.token) {
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
      }));
    }
    
    return response;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, userData);
    
    if (response.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
      }));
    }
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      await api.post(ENDPOINTS.AUTH.LOGOUT);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser(): Promise<{ success: boolean; data: User }> {
    return api.get(ENDPOINTS.AUTH.ME);
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();