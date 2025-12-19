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
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
    token: string;
  };
  error?: string;
}