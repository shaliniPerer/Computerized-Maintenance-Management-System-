import React, { useState, useEffect } from 'react';
import { Button, Input, Select } from '@components/common';
import { WorkOrder, WorkOrderFormData } from '@models/workOrder.types';
import { userService } from 'services';

interface WorkOrderFormProps {
  workOrder: WorkOrder | null;
  onSave: (data: WorkOrderFormData) => void;
  onCancel: () => void;
}

interface UserOption {
  _id: string;
  name: string;
}

export const WorkOrderForm: React.FC<WorkOrderFormProps> = ({
  workOrder,
  onSave,
  onCancel
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserOption[]>([]);

  const [formData, setFormData] = useState<WorkOrderFormData>({
    title: workOrder?.title || '',
    category: workOrder?.category || 'HVAC',
    priority: workOrder?.priority || 'Medium',
    location: workOrder?.location || '',
    assignedTo:
      typeof workOrder?.assignedTo === 'string'
        ? workOrder.assignedTo
        : (workOrder?.assignedTo as any)?._id || '',
    description: workOrder?.description || ''
  });

  // Fetch technicians
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await userService.getAll({ role: 'Technician' });
        if (response.success && Array.isArray(response.data)) {
          const options: UserOption[] = response.data.map((u: any) => ({
            _id: u._id || u.id,
            name: u.name
          }));
          setUsers(options);
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    fetchTechnicians();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      onSave(formData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save work order');
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
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />

      <Select
        label="Category"
        value={formData.category}
        onChange={(e) =>
          setFormData({ ...formData, category: e.target.value as any })
        }
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
        onChange={(e) =>
          setFormData({ ...formData, priority: e.target.value as any })
        }
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
        onChange={(e) =>
          setFormData({ ...formData, location: e.target.value })
        }
        required
      />

      <Select
        label="Assigned To"
        value={formData.assignedTo}
        onChange={(e) =>
          setFormData({ ...formData, assignedTo: e.target.value })
        }
        options={[
          { value: '', label: 'Unassigned' },
          ...users.map((u) => ({ value: u._id, label: u.name }))
        ]}
      />

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Description
        </label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={4}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          variant="secondary"
          onClick={onCancel}
          type="button"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};
