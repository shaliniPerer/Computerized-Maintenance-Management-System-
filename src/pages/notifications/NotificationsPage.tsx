import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button, Alert } from '@components/common';
import { Notification } from '@models/notification.types';
import { notificationService } from 'services';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await notificationService.getAll();
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error: any) {
      setAlert({
        message: error.response?.data?.message || 'Failed to load notifications',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (error: any) {
      setAlert({
        message: error.response?.data?.message || 'Failed to mark as read',
        type: 'error'
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setAlert({ message: 'All notifications marked as read', type: 'success' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      setAlert({
        message: error.response?.data?.message || 'Failed to mark all as read',
        type: 'error'
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await notificationService.delete(id);
      setNotifications(notifications.filter(n => n.id !== id));
      setAlert({ message: 'Notification deleted', type: 'success' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      setAlert({
        message: error.response?.data?.message || 'Failed to delete notification',
        type: 'error'
      });
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
          <p className="text-gray-600 mt-1">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead}>Mark All as Read</Button>
        )}
      </div>
      
      {notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Bell className="text-gray-400 mx-auto mb-4" size={64} />
          <p className="text-gray-600 text-lg">No notifications</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`p-4 border-b hover:bg-gray-50 transition ${!notif.read && 'bg-blue-50'}`}
            >
              <div className="flex items-start justify-between">
                <div 
                  className="flex items-start gap-3 flex-1 cursor-pointer"
                  onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                >
                  <Bell className={notif.read ? 'text-gray-400' : 'text-blue-600'} size={24} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{notif.title}</h3>
                    <p className="text-sm text-gray-600">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!notif.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="text-gray-400 hover:text-red-600 transition"
                    title="Delete"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};