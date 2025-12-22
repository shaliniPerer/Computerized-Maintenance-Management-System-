export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'REACT_APP_API_URL=https://maintenance-pro-backend.vercel.app/api',
  TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  WORK_ORDERS: {
    BASE: '/work-orders',
    BY_ID: (id: string) => `/work-orders/${id}`,
    STATUS: (id: string) => `/work-orders/${id}/status`,
    NOTES: (id: string) => `/work-orders/${id}/notes`,
    ATTACHMENTS: (id: string) => `/work-orders/${id}/attachments`,
  },
  PM_SCHEDULES: {
    BASE: '/pm-schedules',
    BY_ID: (id: string) => `/pm-schedules/${id}`,
    COMPLETE: (id: string) => `/pm-schedules/${id}/complete`,
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    READ: (id: number) => `/notifications/${id}/read`,
    READ_ALL: '/notifications/read-all',
    DELETE: (id: number) => `/notifications/${id}`,
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
};