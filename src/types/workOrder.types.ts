export type WorkOrderCategory = 'HVAC' | 'Electrical' | 'Plumbing' | 'Fire Safety';
export type WorkOrderPriority = 'Emergency' | 'High' | 'Medium' | 'Low';
export type WorkOrderStatus = 'Open' | 'In Progress' | 'Completed' | 'Verified';

export interface WorkOrder {
  _id: string;
  workOrderId: string;
  title: string;
  description: string;
  category: WorkOrderCategory;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  location: string;
  assignedTo?: string;
  assignedToName?: string;
  createdBy: string;
  notes: Array<{
    user: string;
    userName: string;
    text: string;
    createdAt: Date;
  }>;
  attachments: Array<{
    filename: string;
    originalName: string;
    path: string;
    mimetype: string;
    size: number;
    uploadedBy: string;
    uploadedAt: Date;
  }>;
  activityLog: Array<{
    action: string;
    user: string;
    userName: string;
    details: string;
    timestamp: Date;
  }>;
  completedAt?: Date;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkOrderFormData {
  title: string;
  description: string;
  category: WorkOrderCategory;
  priority: WorkOrderPriority;
  location: string;
  assignedTo?: string;
}