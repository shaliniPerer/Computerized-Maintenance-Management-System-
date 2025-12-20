export type PMFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';
export type PMStatus = 'Scheduled' | 'Upcoming' | 'Overdue' | 'Completed';

export interface PMSchedule {
  _id: string;
  pmId: string;
  title: string;
  description?: string;
  asset: string;
  frequency: PMFrequency;
  nextDueDate: Date;
  lastCompletedDate?: Date;
  assignedTo?: string;
  assignedToName?: string;
  status: PMStatus;
  checklist: Array<{
    item: string;
    completed: boolean;
    completedBy?: string;
    completedAt?: Date;
  }>;
  completionNotes?: string;
  createdBy: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PMFormData {
  title: string;
  description?: string;
  asset: string;
  frequency: PMFrequency;
  nextDueDate: string;
  assignedTo?: string;
  checklist?: Array<{
    item: string;
    completed: boolean;
  }>;
}