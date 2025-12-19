import type { User } from '../types/user.types';


export const mockUsers: (User & { password: string })[] = [
  { 
    id: 1, 
    email: 'admin@maintenance.com', 
    password: 'admin123', 
    role: 'Admin', 
    name: 'Admin User' 
  },
  { 
    id: 2, 
    email: 'tech@maintenance.com', 
    password: 'tech123', 
    role: 'Technician', 
    name: 'John Tech' 
  },
  { 
    id: 3, 
    email: 'staff@maintenance.com', 
    password: 'staff123', 
    role: 'Staff', 
    name: 'Staff Member' 
  }
];