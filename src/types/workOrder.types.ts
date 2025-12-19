export type WorkOrderCategory = 'HVAC' | 'Electrical' | 'Plumbing' | 'Fire Safety';
export type WorkOrderPriority = 'Emergency' | 'High' | 'Medium' | 'Low';
export type WorkOrderStatus = 'Open' | 'In Progress' | 'Completed' | 'Verified';

export interface WorkOrder {
  id: string;
  title: string;
  category: WorkOrderCategory;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  createdDate: string;
  assignedTo: string;
  location: string;
  description: string;
}

export interface WorkOrderFormData {
  title: string;
  category: WorkOrderCategory;
  priority: WorkOrderPriority;
  location: string;
  assignedTo: string;
  description: string;
}