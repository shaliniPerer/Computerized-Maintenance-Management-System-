import React, { useState } from 'react';
import { Button, Badge, Alert } from '@components/common';
import { PMSchedule } from '@models/pm.types';
import { getPMStatusColor } from '@utils/helpers';

interface PMChecklistProps {
  schedule: PMSchedule;
  onBack: () => void;
}

export const PMChecklist: React.FC<PMChecklistProps> = ({ schedule, onBack }) => {
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const checklistItems = [
    'Inspect filters and replace if dirty',
    'Check refrigerant levels',
    'Test thermostat functionality',
    'Clean condenser coils',
    'Verify all electrical connections'
  ];

  const handleComplete = () => {
    setAlert({ message: 'PM task completed successfully!', type: 'success' });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div className="p-6">
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      
      <button onClick={onBack} className="mb-4 text-blue-600 hover:underline flex items-center gap-2">
        ← Back to PM Schedules
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{schedule.title}</h1>
        <p className="text-gray-600 mb-6">{schedule.id} - {schedule.asset}</p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Schedule Details</h3>
            <div className="space-y-2 text-gray-600">
              <p><strong>Frequency:</strong> {schedule.frequency}</p>
              <p><strong>Next Due Date:</strong> {schedule.nextDate}</p>
              <p><strong>Assigned To:</strong> {schedule.assignedTo}</p>
              <p><strong>Status:</strong> <Badge color={getPMStatusColor(schedule.status)}>{schedule.status}</Badge></p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Maintenance Checklist</h3>
          <div className="space-y-3">
            {checklistItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <input type="checkbox" className="w-5 h-5 cursor-pointer" />
                <span className="flex-1">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Completion Notes</h3>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Add notes about the maintenance performed..."
          />
          <Button variant="success" className="mt-2" onClick={handleComplete}>Complete Task</Button>
        </div>
      </div>
    </div>
  );
};