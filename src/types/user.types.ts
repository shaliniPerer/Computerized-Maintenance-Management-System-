export interface User {
  id: number;
  email: string;
  role: 'Admin' | 'Technician' | 'Staff';
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
}