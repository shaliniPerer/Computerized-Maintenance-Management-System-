import { api } from './api';
import { ENDPOINTS } from '../config/apiConfig';
import { User } from '../types';

interface UsersResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: User[];
}

interface UserResponse {
  success: boolean;
  data: User;
}

interface UserFilters {
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}

class UserService {
  async getAll(filters?: UserFilters): Promise<UsersResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    
    const url = `${ENDPOINTS.USERS.BASE}${params.toString() ? `?${params.toString()}` : ''}`;
    return api.get<UsersResponse>(url);
  }

  async getById(id: string): Promise<UserResponse> {
    return api.get<UserResponse>(ENDPOINTS.USERS.BY_ID(id));
  }

  async update(id: string, data: Partial<User>): Promise<UserResponse> {
    return api.put<UserResponse>(ENDPOINTS.USERS.BY_ID(id), data);
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    return api.delete(ENDPOINTS.USERS.BY_ID(id));
  }
}

export const userService = new UserService();