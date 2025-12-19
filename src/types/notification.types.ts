export type NotificationType = 'work_order' | 'pm' | 'status' | 'alert';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}