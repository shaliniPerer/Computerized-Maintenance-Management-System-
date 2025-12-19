// Route Constants
export const ROUTES = {
  HOME: 'home',
  LOGIN: 'login',
  DASHBOARD: 'dashboard',
  WORK_ORDERS: 'workorders',
  PM: 'pm',
  NOTIFICATIONS: 'notifications',
} as const;

// Work Order Categories
export const CATEGORIES = [
  'All', 
  'HVAC', 
  'Electrical', 
  'Plumbing', 
  'Fire Safety'
] as const;

export const CATEGORY_OPTIONS = [
  { value: 'HVAC', label: 'HVAC' },
  { value: 'Electrical', label: 'Electrical' },
  { value: 'Plumbing', label: 'Plumbing' },
  { value: 'Fire Safety', label: 'Fire Safety' },
] as const;

// Work Order Priorities
export const PRIORITIES = [
  'All', 
  'Emergency', 
  'High', 
  'Medium', 
  'Low'
] as const;

export const PRIORITY_OPTIONS = [
  { value: 'Emergency', label: 'Emergency' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
] as const;

// Work Order Statuses
export const STATUSES = [
  'All', 
  'Open', 
  'In Progress', 
  'Completed', 
  'Verified'
] as const;

export const STATUS_OPTIONS = [
  { value: 'Open', label: 'Open' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Verified', label: 'Verified' },
] as const;

// PM Frequencies
export const FREQUENCIES = [
  'Daily', 
  'Weekly', 
  'Monthly', 
  'Quarterly', 
  'Annually'
] as const;

export const FREQUENCY_OPTIONS = [
  { value: 'Daily', label: 'Daily' },
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Quarterly', label: 'Quarterly' },
  { value: 'Annually', label: 'Annually' },
] as const;

// PM Statuses
export const PM_STATUSES = [
  'Scheduled', 
  'Upcoming', 
  'Overdue', 
  'Completed'
] as const;

// User Roles
export const USER_ROLES = [
  'Admin', 
  'Technician', 
  'Staff'
] as const;

// Notification Types
export const NOTIFICATION_TYPES = [
  'work_order', 
  'pm', 
  'status', 
  'alert'
] as const;

// Color Mappings
export const PRIORITY_COLORS = {
  Emergency: 'red',
  High: 'orange',
  Medium: 'yellow',
  Low: 'blue',
} as const;

export const STATUS_COLORS = {
  Open: 'gray',
  'In Progress': 'orange',
  Completed: 'green',
  Verified: 'blue',
} as const;

export const PM_STATUS_COLORS = {
  Scheduled: 'green',
  Upcoming: 'yellow',
  Overdue: 'red',
  Completed: 'blue',
} as const;

// Badge Color Type
export type BadgeColorType = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'gray';

// Date Format
export const DATE_FORMAT = {
  SHORT: 'MM/DD/YYYY',
  LONG: 'MMMM DD, YYYY',
  TIME: 'hh:mm A',
  FULL: 'MMMM DD, YYYY hh:mm A',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  THEME: 'theme',
  PREFERENCES: 'preferences',
} as const;

// API Endpoints (for future backend integration)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  WORK_ORDERS: {
    LIST: '/api/work-orders',
    CREATE: '/api/work-orders',
    GET: (id: string) => `/api/work-orders/${id}`,
    UPDATE: (id: string) => `/api/work-orders/${id}`,
    DELETE: (id: string) => `/api/work-orders/${id}`,
    UPDATE_STATUS: (id: string) => `/api/work-orders/${id}/status`,
  },
  PM: {
    LIST: '/api/pm-schedules',
    CREATE: '/api/pm-schedules',
    GET: (id: string) => `/api/pm-schedules/${id}`,
    UPDATE: (id: string) => `/api/pm-schedules/${id}`,
    DELETE: (id: string) => `/api/pm-schedules/${id}`,
    COMPLETE: (id: string) => `/api/pm-schedules/${id}/complete`,
  },
  NOTIFICATIONS: {
    LIST: '/api/notifications',
    MARK_READ: (id: number) => `/api/notifications/${id}/read`,
    MARK_ALL_READ: '/api/notifications/read-all',
  },
  USERS: {
    LIST: '/api/users',
    GET: (id: number) => `/api/users/${id}`,
    UPDATE: (id: number) => `/api/users/${id}`,
    DELETE: (id: number) => `/api/users/${id}`,
  },
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'video/mp4',
    'video/quicktime',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.mp4', '.mov', '.doc', '.docx'],
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: false,
  },
  WORK_ORDER: {
    TITLE_MIN_LENGTH: 5,
    TITLE_MAX_LENGTH: 100,
    DESCRIPTION_MIN_LENGTH: 10,
    DESCRIPTION_MAX_LENGTH: 1000,
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 8 characters',
  INVALID_PHONE: 'Please enter a valid phone number',
  LOGIN_FAILED: 'Invalid email or password',
  NETWORK_ERROR: 'Network error. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  SERVER_ERROR: 'Server error. Please try again later.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  CREATED: 'Created successfully',
  UPDATED: 'Updated successfully',
  DELETED: 'Deleted successfully',
  STATUS_UPDATED: 'Status updated successfully',
  NOTIFICATION_READ: 'Notification marked as read',
  FILE_UPLOADED: 'File uploaded successfully',
} as const;

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'MaintenancePro',
  APP_VERSION: '1.0.0',
  COMPANY_NAME: 'Your Company Name',
  SUPPORT_EMAIL: 'support@maintenancepro.com',
  SUPPORT_PHONE: '+1 (555) 123-4567',
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];