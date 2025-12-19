import type { PMSchedule } from '../types/pm.types';



export const mockPMSchedules: PMSchedule[] = [
  { 
    id: 'PM-001', 
    title: 'HVAC Filter Replacement', 
    asset: 'HVAC Unit A-301', 
    frequency: 'Monthly', 
    nextDate: '2024-12-25', 
    assignedTo: 'John Tech', 
    status: 'Scheduled' 
  },
  { 
    id: 'PM-002', 
    title: 'Generator Inspection', 
    asset: 'Emergency Generator B1', 
    frequency: 'Quarterly', 
    nextDate: '2024-12-30', 
    assignedTo: 'Mike Wilson', 
    status: 'Overdue' 
  },
  { 
    id: 'PM-003', 
    title: 'Fire Extinguisher Check', 
    asset: 'All Fire Extinguishers', 
    frequency: 'Monthly', 
    nextDate: '2024-12-20', 
    assignedTo: 'Sarah Johnson', 
    status: 'Upcoming' 
  },
  { 
    id: 'PM-004', 
    title: 'Elevator Maintenance', 
    asset: 'Elevator 1-3', 
    frequency: 'Weekly', 
    nextDate: '2024-12-22', 
    assignedTo: 'John Tech', 
    status: 'Scheduled' 
  }
];