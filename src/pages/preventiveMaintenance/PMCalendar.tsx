import React, { useState, useEffect } from 'react';
import { PMSchedule } from '@models/pm.types';
import { Badge } from '@components/common';
import { pmScheduleService } from 'services';
import { getPMStatusColor } from '@utils/helpers';

export const PMCalendar: React.FC = () => {
  const [schedules, setSchedules] = useState<PMSchedule[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setIsLoading(true);
      const response = await pmScheduleService.getAll({ limit: 100 });
      if (response.success) {
        setSchedules(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch PM schedules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getSchedulesForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return schedules.filter(schedule => {
      const dueDate = new Date(schedule.nextDueDate);
      return (
        dueDate.getFullYear() === date.getFullYear() &&
        dueDate.getMonth() === date.getMonth() &&
        dueDate.getDate() === date.getDate()
      );
    });
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Previous
        </button>
        <h2 className="text-2xl font-bold text-gray-800">{monthName}</h2>
        <button
          onClick={nextMonth}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold text-gray-700 p-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: startingDayOfWeek }, (_, i) => (
          <div key={`empty-${i}`} className="border rounded-lg p-3 h-24 bg-gray-50"></div>
        ))}
        
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const daySchedules = getSchedulesForDate(day);
          
          return (
            <div key={day} className="border rounded-lg p-2 h-24 hover:bg-gray-50 cursor-pointer transition overflow-y-auto">
              <p className="text-sm font-semibold text-gray-700 mb-1">{day}</p>
              <div className="space-y-1">
                {daySchedules.map(schedule => (
                  <div
                    key={schedule._id}
                    className="text-xs px-1 py-0.5 rounded truncate"
                    style={{
                      backgroundColor: getPMStatusColor(schedule.status) === 'red' ? '#fee2e2' :
                                      getPMStatusColor(schedule.status) === 'yellow' ? '#fef3c7' :
                                      getPMStatusColor(schedule.status) === 'green' ? '#d1fae5' : '#dbeafe',
                      color: getPMStatusColor(schedule.status) === 'red' ? '#991b1b' :
                             getPMStatusColor(schedule.status) === 'yellow' ? '#92400e' :
                             getPMStatusColor(schedule.status) === 'green' ? '#065f46' : '#1e40af'
                    }}
                    title={schedule.title}
                  >
                    {schedule.pmId}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};