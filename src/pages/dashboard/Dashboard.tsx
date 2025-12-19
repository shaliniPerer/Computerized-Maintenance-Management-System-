import React from 'react';
import { Briefcase, Clock, Check, AlertTriangle } from 'lucide-react';
import { Badge } from '@components/common';
import { mockWorkOrders } from '@data/mockWorkOrders';
import { getPMStatusColor, getPriorityColor } from '@utils/helpers';
import { mockPMSchedules } from '@data/mockPMSchedules';

export const Dashboard: React.FC = () => {
  const stats = {
    total: mockWorkOrders.length,
    open: mockWorkOrders.filter(wo => wo.status === 'Open').length,
    inProgress: mockWorkOrders.filter(wo => wo.status === 'In Progress').length,
    completed: mockWorkOrders.filter(wo => wo.status === 'Completed').length,
    emergency: mockWorkOrders.filter(wo => wo.priority === 'Emergency').length,
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Work Orders</p>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <Briefcase className="text-blue-600" size={48} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">In Progress</p>
              <p className="text-3xl font-bold text-orange-600">{stats.inProgress}</p>
            </div>
            <Clock className="text-orange-600" size={48} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completed</p>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <Check className="text-green-600" size={48} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Emergency</p>
              <p className="text-3xl font-bold text-red-600">{stats.emergency}</p>
            </div>
            <AlertTriangle className="text-red-600" size={48} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Work Orders</h2>
          <div className="space-y-3">
            {mockWorkOrders.slice(0, 5).map(wo => (
              <div key={wo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{wo.title}</p>
                  <p className="text-sm text-gray-600">{wo.id} - {wo.location}</p>
                </div>
                <Badge color={getPriorityColor(wo.priority)}>
                  {wo.priority}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming PM Tasks</h2>
          <div className="space-y-3">
            {mockPMSchedules.map(pm => (
              <div key={pm.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{pm.title}</p>
                  <p className="text-sm text-gray-600">{pm.asset}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-700">{pm.nextDate}</p>
                  <Badge color={getPMStatusColor(pm.status)}>
                    {pm.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};