import React, { useState, useEffect } from 'react';
import { Button, Input, Select } from '@components/common';
import { pmScheduleService, userService } from 'services';
import { PMFormData, PMSchedule } from '@models/pm.types';

interface PMFormProps {
  schedule: PMSchedule | null;
  onSave: () => void;
  onCancel: () => void;
}

export const PMForm: React.FC<PMFormProps> = ({ schedule, onSave, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [technicians, setTechnicians] = useState<any[]>([]);
  
  const [formData, setFormData] = useState<PMFormData>({
    title: schedule?.title || '',
    description: schedule?.description || '',
    asset: schedule?.asset || '',
    frequency: schedule?.frequency || 'Monthly',
    nextDueDate: schedule?.nextDueDate ? new Date(schedule.nextDueDate).toISOString().split('T')[0] : '',
    assignedTo: schedule?.assignedTo || '',
    checklist: schedule?.checklist || []
  });

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    try {
      const response = await userService.getAll({ role: 'Technician' });
      if (response.success) {
        setTechnicians(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch technicians:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (schedule) {
        await pmScheduleService.update(schedule._id, formData);
      } else {
        await pmScheduleService.create(formData);
      }
      onSave();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save PM schedule');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Input 
        label="Task Title" 
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
        placeholder="Enter PM task title"
      />

      <Input 
        label="Asset" 
        value={formData.asset}
        onChange={(e) => setFormData({ ...formData, asset: e.target.value })}
        required
        placeholder="e.g., HVAC Unit A-301"
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
        value={formData.nextDueDate}
        onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
        required
      />

      <Select
        label="Assign To"
        value={formData.assignedTo}
        onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
        options={[
          { value: '', label: 'Select Technician' },
          ...technicians.map(tech => ({ value: tech._id, label: tech.name }))
        ]}
      />

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Optional description"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="secondary" onClick={onCancel} type="button" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};