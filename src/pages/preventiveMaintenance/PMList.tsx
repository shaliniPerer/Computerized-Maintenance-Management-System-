import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit2 } from 'lucide-react';
import { Button, Badge, Modal, Alert } from '@components/common';
import { PMForm } from './PMForm';
import { PMChecklist } from './PMChecklist';
import { pmScheduleService } from 'services';
import { getPMStatusColor } from '@utils/helpers';
import { PMSchedule } from '@models/pm.types';

export const PMList: React.FC = () => {
  const [schedules, setSchedules] = useState<PMSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPM, setSelectedPM] = useState<PMSchedule | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'checklist'>('list');
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchPMSchedules();
  }, []);

  const fetchPMSchedules = async () => {
    try {
      setIsLoading(true);
      const response = await pmScheduleService.getAll({ limit: 100 });
      if (response.success) {
        setSchedules(response.data);
      }
    } catch (error: any) {
      setAlert({ 
        message: error.response?.data?.message || 'Failed to load PM schedules', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewChecklist = (pm: PMSchedule) => {
    setSelectedPM(pm);
    setViewMode('checklist');
  };

  const handleEdit = (pm: PMSchedule) => {
    setSelectedPM(pm);
    setOpenDialog(true);
  };

  const handleCreateNew = () => {
    setSelectedPM(null);
    setOpenDialog(true);
  };

  const handleSave = async () => {
    setOpenDialog(false);
    setAlert({ message: 'PM schedule saved successfully!', type: 'success' });
    setTimeout(() => setAlert(null), 3000);
    await fetchPMSchedules();
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedPM(null);
    fetchPMSchedules();
  };

  if (viewMode === 'checklist' && selectedPM) {
    return <PMChecklist schedule={selectedPM} onBack={handleBackToList} />;
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading PM schedules...</p>
      </div>
    );
  }

  return (
    <div>
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">PM Schedule List</h2>
        <Button onClick={handleCreateNew}>
          <Plus size={20} />
          Schedule PM Task
        </Button>
      </div>

      {schedules.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 text-lg">No PM schedules found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">PM ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Task Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Asset</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Frequency</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Next Due</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {schedules.map(pm => (
                  <tr key={pm._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{pm.pmId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{pm.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{pm.asset}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{pm.frequency}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(pm.nextDueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{pm.assignedToName || 'Unassigned'}</td>
                    <td className="px-6 py-4 text-sm">
                      <Badge color={getPMStatusColor(pm.status)}>{pm.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewChecklist(pm)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Checklist"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(pm)}
                          className="text-green-600 hover:text-green-800"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={openDialog}
        onClose={() => setOpenDialog(false)}
        title={selectedPM ? 'Edit PM Schedule' : 'Create PM Schedule'}
        size="lg"
      >
        <PMForm schedule={selectedPM} onSave={handleSave} onCancel={() => setOpenDialog(false)} />
      </Modal>
    </div>
  );
};