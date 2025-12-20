import React, { useState, useEffect } from 'react';
import { Briefcase, Clock, Check, AlertTriangle } from 'lucide-react';
import { Badge } from '@components/common';
import { WorkOrder } from '@models/workOrder.types';
import { PMSchedule } from '@models/pm.types';
import { pmScheduleService, workOrderService } from 'services';
import { getPMStatusColor, getPriorityColor } from '@utils/helpers';

export const Dashboard: React.FC = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [pmSchedules, setPMSchedules] = useState<PMSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [woResponse, pmResponse] = await Promise.all([
        workOrderService.getAll({ limit: 10 }),
        pmScheduleService.getAll({ limit: 10 })
      ]);

      if (woResponse.success) {
        setWorkOrders(woResponse.data);
      }
      if (pmResponse.success) {
        setPMSchedules(pmResponse.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    total: workOrders.length,
    open: workOrders.filter(wo => wo.status === 'Open').length,
    inProgress: workOrders.filter(wo => wo.status === 'In Progress').length,
    completed: workOrders.filter(wo => wo.status === 'Completed').length,
    emergency: workOrders.filter(wo => wo.priority === 'Emergency').length,
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* ... stats cards remain the same ... */}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Work Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Work Orders</h2>
          {workOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No work orders found</p>
          ) : (
            <div className="space-y-3">
              {workOrders.slice(0, 5).map(wo => (
                <div key={wo._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{wo.title}</p>
                    <p className="text-sm text-gray-600">{wo.workOrderId} - {wo.location}</p>
                  </div>
                  <Badge color={getPriorityColor(wo.priority)}>
                    {wo.priority}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming PM Tasks */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming PM Tasks</h2>
          {pmSchedules.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No PM schedules found</p>
          ) : (
            <div className="space-y-3">
              {pmSchedules.map(pm => (
                <div key={pm._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{pm.title}</p>
                    <p className="text-sm text-gray-600">{pm.asset}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-700">
                      {new Date(pm.nextDueDate).toLocaleDateString()}
                    </p>
                    <Badge color={getPMStatusColor(pm.status)}>
                      {pm.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};