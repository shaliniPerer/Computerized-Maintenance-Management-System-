export const API_CONFIG = {
  BASE_URL:
    process.env.REACT_APP_API_URL ||
    'https://calm-wholeness-production-c9b5.up.railway.app',
  TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
  },

  WORK_ORDERS: {
    BASE: '/api/work-orders',
    BY_ID: (id: string) => `/api/work-orders/${id}`,
    STATUS: (id: string) => `/api/work-orders/${id}/status`,
    NOTES: (id: string) => `/api/work-orders/${id}/notes`,
    ATTACHMENTS: (id: string) => `/api/work-orders/${id}/attachments`,
  },

  PM_SCHEDULES: {
    BASE: '/api/pm-schedules',
    BY_ID: (id: string) => `/api/pm-schedules/${id}`,
    COMPLETE: (id: string) => `/api/pm-schedules/${id}/complete`,
  },

  NOTIFICATIONS: {
    BASE: '/api/notifications',
    READ: (id: number) => `/api/notifications/${id}/read`,
    READ_ALL: '/api/notifications/read-all',
    DELETE: (id: number) => `/api/notifications/${id}`,
  },

  USERS: {
    BASE: '/api/users',
    BY_ID: (id: string) => `/api/users/${id}`,
  },
};
