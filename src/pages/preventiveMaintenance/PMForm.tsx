import React, { useState } from 'react';
import { Button, Input, Select } from '@components/common';
import { PMSchedule, PMFormData } from '@models/pm.types';

interface PMFormProps {
  schedule: PMSchedule | null;
  onSave: () => void;
  onCancel: () => void;
}

export const PMForm: React.FC<PMFormProps> = ({ schedule, onSave, onCancel }) => {
  const [formData, setFormData] = useState<PMFormData>({
    title: schedule?.title || '',
    asset: schedule?.asset || '',
    frequency: schedule?.frequency || 'Monthly',
    nextDate: schedule?.nextDate || '',
    assignedTo: schedule?.assignedTo || '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input 
        label="Task Title" 
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <Input 
        label="Asset" 
        value={formData.asset}
        onChange={(e) => setFormData({ ...formData, asset: e.target.value })}
        required
      />
      <Select
        label="Frequency"
        value={formData.frequency}
        onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
        options={[
          { value: 'Daily', label: 'Daily' },
          { value: 'Weekly', label: 'Weekly' },
          { value: 'Monthly', label: 'Monthly' },
          { value: 'Quarterly', label: 'Quarterly' },
          { value: 'Annually', label: 'Annually' }
        ]}
      />
      <Input 
        label="Next Due Date" 
        type="date" 
        value={formData.nextDate}
        onChange={(e) => setFormData({ ...formData, nextDate: e.target.value })}
        required
      />
      <Input 
        label="Assigned To" 
        value={formData.assignedTo}
        onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
        required
      />
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="secondary" onClick={onCancel} type="button">Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};