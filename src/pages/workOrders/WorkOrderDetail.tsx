import React, { useState } from 'react';
import { Paperclip } from 'lucide-react';
import { Button, Badge, Alert } from '@components/common';
import { WorkOrder } from '@models/workOrder.types';
import { getPriorityColor, getStatusColor } from '@utils/helpers';

interface WorkOrderDetailProps {
  workOrder: WorkOrder;
  onBack: () => void;
}

export const WorkOrderDetail: React.FC<WorkOrderDetailProps> = ({ workOrder, onBack }) => {
  const [currentWO, setCurrentWO] = useState(workOrder);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleStatusChange = (newStatus: WorkOrder['status']) => {
    setCurrentWO({ ...currentWO, status: newStatus });
    setAlert({ message: `Status updated to ${newStatus}`, type: 'success' });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div className="p-6">
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      
      <button
        onClick={onBack}
        className="mb-4 text-blue-600 hover:underline flex items-center gap-2"
      >
        ← Back to Work Orders
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{currentWO.title}</h1>
            <p className="text-gray-600">{currentWO.id}</p>
          </div>
          <div className="flex gap-2">
            <Badge color={getPriorityColor(currentWO.priority)}>{currentWO.priority}</Badge>
            <Badge color={getStatusColor(currentWO.status)}>{currentWO.status}</Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Work Order Details</h3>
            <div className="space-y-2 text-gray-600">
              <p><strong>Category:</strong> {currentWO.category}</p>
              <p><strong>Location:</strong> {currentWO.location}</p>
              <p><strong>Assigned To:</strong> {currentWO.assignedTo}</p>
              <p><strong>Created Date:</strong> {currentWO.createdDate}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600">{currentWO.description}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Status Progression</h3>
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              variant={currentWO.status === 'Open' ? 'primary' : 'secondary'} 
              size="sm"
              onClick={() => handleStatusChange('Open')}
            >
              Open
            </Button>
            <span className="text-gray-400">→</span>
            <Button 
              variant={currentWO.status === 'In Progress' ? 'primary' : 'secondary'} 
              size="sm"
              onClick={() => handleStatusChange('In Progress')}
            >
              In Progress
            </Button>
            <span className="text-gray-400">→</span>
            <Button 
              variant={currentWO.status === 'Completed' ? 'primary' : 'secondary'} 
              size="sm"
              onClick={() => handleStatusChange('Completed')}
            >
              Completed
            </Button>
            <span className="text-gray-400">→</span>
            <Button 
              variant={currentWO.status === 'Verified' ? 'primary' : 'secondary'} 
              size="sm"
              onClick={() => handleStatusChange('Verified')}
            >
              Verified
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Technician Notes</h3>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Add notes about this work order..."
          />
          <Button className="mt-2">Add Note</Button>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Attachments</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
            <Paperclip className="text-gray-400 mx-auto mb-2" size={48} />
            <p className="text-gray-600 mb-2">Upload images, videos, or documents</p>
            <label className="cursor-pointer">
              <input type="file" multiple className="hidden" />
              <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Choose Files
              </span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Activity Log</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                JT
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">John Tech</p>
                <p className="text-sm text-gray-600">Status changed to In Progress</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">
                AU
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Admin User</p>
                <p className="text-sm text-gray-600">Work order created</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};