import { api } from './api';
import { ENDPOINTS } from '../config/apiConfig';
import { Notification } from '../types';

interface NotificationsResponse {
  success: boolean;
  count: number;
  total: number;
  unreadCount: number;
  page: number;
  pages: number;
  data: Notification[];
}

interface NotificationResponse {
  success: boolean;
  data: Notification;
}

class NotificationService {
  async getAll(page: number = 1, limit: number = 20): Promise<NotificationsResponse> {
    const url = `${ENDPOINTS.NOTIFICATIONS.BASE}?page=${page}&limit=${limit}`;
    return api.get<NotificationsResponse>(url);
  }

  async markAsRead(id: number): Promise<NotificationResponse> {
    return api.patch<NotificationResponse>(ENDPOINTS.NOTIFICATIONS.READ(id));
  }

  async markAllAsRead(): Promise<{ success: boolean; message: string }> {
    return api.patch(ENDPOINTS.NOTIFICATIONS.READ_ALL);
  }

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    return api.delete(ENDPOINTS.NOTIFICATIONS.DELETE(id));
  }
}

export const notificationService = new NotificationService();