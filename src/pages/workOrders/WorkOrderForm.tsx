import React, { useState } from 'react';
import { Button, Input, Select } from '@components/common';
import { WorkOrder,WorkOrderFormData } from '@models/workOrder.types';

interface WorkOrderFormProps {
  workOrder: WorkOrder | null;
  onSave: () => void;
  onCancel: () => void;
}

export const WorkOrderForm: React.FC<WorkOrderFormProps> = ({ workOrder, onSave, onCancel }) => {
  const [formData, setFormData] = useState<WorkOrderFormData>({
    title: workOrder?.title || '',
    category: workOrder?.category || 'HVAC',
    priority: workOrder?.priority || 'Medium',
    location: workOrder?.location || '',
    assignedTo: workOrder?.assignedTo || '',
    description: workOrder?.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input 
        label="Title" 
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <Select
        label="Category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
        options={[
          { value: 'HVAC', label: 'HVAC' },
          { value: 'Electrical', label: 'Electrical' },
          { value: 'Plumbing', label: 'Plumbing' },
          { value: 'Fire Safety', label: 'Fire Safety' }
        ]}
      />
      <Select
        label="Priority"
        value={formData.priority}
        onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
        options={[
          { value: 'Emergency', label: 'Emergency' },
          { value: 'High', label: 'High' },
          { value: 'Medium', label: 'Medium' },
          { value: 'Low', label: 'Low' }
        ]}
      />
      <Input 
        label="Location" 
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="secondary" onClick={onCancel} type="button">Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};