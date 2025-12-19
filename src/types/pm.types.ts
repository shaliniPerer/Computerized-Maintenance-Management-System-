export type PMFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';
export type PMStatus = 'Scheduled' | 'Upcoming' | 'Overdue' | 'Completed';

export interface PMSchedule {
  id: string;
  title: string;
  asset: string;
  frequency: PMFrequency;
  nextDate: string;
  assignedTo: string;
  status: PMStatus;
}

export interface PMFormData {
  title: string;
  asset: string;
  frequency: PMFrequency;
  nextDate: string;
  assignedTo: string;
  description?: string;
}