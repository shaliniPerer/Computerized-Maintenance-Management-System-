import React, { useState } from 'react';
import { Button, Badge, Alert } from '@components/common';
import { pmScheduleService } from 'services';
import { getPMStatusColor } from '@utils/helpers';
import { PMSchedule } from '@models/pm.types';

interface PMChecklistProps {
  schedule: PMSchedule;
  onBack: () => void;
}

export const PMChecklist: React.FC<PMChecklistProps> = ({ schedule, onBack }) => {
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [checklist, setChecklist] = useState(schedule.checklist || []);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleChecklistChange = (index: number) => {
    const updated = [...checklist];
    updated[index].completed = !updated[index].completed;
    setChecklist(updated);
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      const response = await pmScheduleService.completeTask(schedule._id, {
        completionNotes,
        checklist
      });
      
      if (response.success) {
        setAlert({ message: 'PM task completed successfully!', type: 'success' });
        setTimeout(() => {
          setAlert(null);
          onBack();
        }, 2000);
      }
    } catch (error: any) {
      setAlert({ 
        message: error.response?.data?.message || 'Failed to complete PM task', 
        type: 'error' 
      });
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="p-6">
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      
      <button onClick={onBack} className="mb-4 text-blue-600 hover:underline flex items-center gap-2">
        ← Back to PM Schedules
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{schedule.title}</h1>
        <p className="text-gray-600 mb-6">{schedule.pmId} - {schedule.asset}</p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Schedule Details</h3>
            <div className="space-y-2 text-gray-600">
              <p><strong>Frequency:</strong> {schedule.frequency}</p>
              <p><strong>Next Due Date:</strong> {new Date(schedule.nextDueDate).toLocaleDateString()}</p>
              <p><strong>Assigned To:</strong> {schedule.assignedToName || 'Unassigned'}</p>
              <p><strong>Status:</strong> <Badge color={getPMStatusColor(schedule.status)}>{schedule.status}</Badge></p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600">{schedule.description || 'No description available'}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Maintenance Checklist</h3>
          <div className="space-y-3">
            {checklist.length > 0 ? (
              checklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 cursor-pointer" 
                    checked={item.completed}
                    onChange={() => handleChecklistChange(idx)}
                  />
                  <span className={`flex-1 ${item.completed ? 'line-through text-gray-400' : ''}`}>
                    {item.item}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No checklist items</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Completion Notes</h3>
          <textarea
            value={completionNotes}
            onChange={(e) => setCompletionNotes(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Add notes about the maintenance performed..."
          />
          <Button 
            variant="success" 
            className="mt-2"
            onClick={handleComplete}
            disabled={isCompleting}
          >
            {isCompleting ? 'Completing...' : 'Complete Task'}
          </Button>
        </div>
      </div>
    </div>
  );
};