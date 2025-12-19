import React, { useState } from 'react';
import { Plus, Eye, Edit2, Search, Filter, Wind, Zap, Droplet, Flame, Wrench } from 'lucide-react';
import { Button, Badge, Select, Modal, Alert } from '@components/common';
import { mockWorkOrders } from '../../data/mockWorkOrders';
import { WorkOrderForm } from './WorkOrderForm';
import { WorkOrderDetail } from './WorkOrderDetail';
import { CATEGORIES, PRIORITIES, STATUSES } from '@utils/constants';
import { getPriorityColor, getStatusColor } from '@utils/helpers';
import { WorkOrderCategory,WorkOrder } from '@models/workOrder.types';

export const WorkOrdersList: React.FC = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(mockWorkOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const filteredWorkOrders = workOrders.filter(wo => {
    const matchesSearch = wo.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         wo.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || wo.category === filterCategory;
    const matchesPriority = filterPriority === 'All' || wo.priority === filterPriority;
    const matchesStatus = filterStatus === 'All' || wo.status === filterStatus;
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const getCategoryIcon = (category: WorkOrderCategory) => {
    const icons = {
      'HVAC': <Wind size={20} />,
      'Electrical': <Zap size={20} />,
      'Plumbing': <Droplet size={20} />,
      'Fire Safety': <Flame size={20} />,
    };
    return icons[category] || <Wrench size={20} />;
  };

  const handleViewDetails = (wo: WorkOrder) => {
    setSelectedWO(wo);
    setViewMode('detail');
  };

  const handleEdit = (wo: WorkOrder) => {
    setSelectedWO(wo);
    setOpenDialog(true);
  };

  const handleCreateNew = () => {
    setSelectedWO(null);
    setOpenDialog(true);
  };

  const handleSave = () => {
    setOpenDialog(false);
    setAlert({ message: 'Work order saved successfully!', type: 'success' });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedWO(null);
  };

  if (viewMode === 'detail' && selectedWO) {
    return <WorkOrderDetail workOrder={selectedWO} onBack={handleBackToList} />;
  }

  return (
    <div className="p-6">
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Work Orders</h1>
        <Button onClick={handleCreateNew}>
          <Plus size={20} />
          Create Work Order
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search work orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            options={CATEGORIES.map(c => ({ value: c, label: c }))}
          />
          <Select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            options={PRIORITIES.map(p => ({ value: p, label: p }))}
          />
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={STATUSES.map(s => ({ value: s, label: s }))}
          />
          <Button variant="outline">
            <Filter size={20} />
            Filters
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredWorkOrders.map(wo => (
                <tr key={wo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{wo.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{wo.title}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(wo.category)}
                      <span>{wo.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Badge color={getPriorityColor(wo.priority)}>{wo.priority}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Badge color={getStatusColor(wo.status)}>{wo.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{wo.assignedTo}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{wo.createdDate}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(wo)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(wo)}
                        className="text-green-600 hover:text-green-800"
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

      <Modal
        isOpen={openDialog}
        onClose={() => setOpenDialog(false)}
        title={selectedWO ? 'Edit Work Order' : 'Create New Work Order'}
        size="lg"
      >
        <WorkOrderForm workOrder={selectedWO} onSave={handleSave} onCancel={() => setOpenDialog(false)} />
      </Modal>
    </div>
  );
};