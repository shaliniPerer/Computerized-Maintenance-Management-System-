import React from 'react';
import { Bell } from 'lucide-react';
import { Notification } from '@models/notification.types';

export const NotificationsPage: React.FC = () => {
  const notifications: Notification[] = [
    { id: 1, type: 'work_order', title: 'New Work Order Assigned', message: 'WO-004 has been assigned to you', time: '5 minutes ago', read: false },
    { id: 2, type: 'pm', title: 'PM Task Due Soon', message: 'HVAC Filter Replacement due in 2 days', time: '1 hour ago', read: false },
    { id: 3, type: 'status', title: 'Work Order Completed', message: 'WO-003 marked as completed', time: '3 hours ago', read: true },
    { id: 4, type: 'alert', title: 'Emergency Work Order', message: 'New emergency WO-001 created', time: '1 day ago', read: true },
    { id: 5, type: 'pm', title: 'PM Task Overdue', message: 'Generator Inspection is now overdue', time: '2 days ago', read: true }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Notifications</h1>
      
      <div className="bg-white rounded-lg shadow-md">
        {notifications.map(notif => (
          <div key={notif.id} className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition ${!notif.read && 'bg-blue-50'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Bell className={notif.read ? 'text-gray-400' : 'text-blue-600'} size={24} />
                <div>
                  <h3 className="font-semibold text-gray-800">{notif.title}</h3>
                  <p className="text-sm text-gray-600">{notif.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                </div>
              </div>
              {!notif.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};