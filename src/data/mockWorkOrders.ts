import type { WorkOrder } from '../types/workOrder.types';


export const mockWorkOrders: WorkOrder[] = [
  { 
    id: 'WO-001', 
    title: 'HVAC System Malfunction', 
    category: 'HVAC', 
    priority: 'Emergency', 
    status: 'In Progress', 
    createdDate: '2024-12-15', 
    assignedTo: 'John Tech', 
    location: 'Building A - Floor 3', 
    description: 'AC unit not cooling properly' 
  },
  { 
    id: 'WO-002', 
    title: 'Electrical Panel Check', 
    category: 'Electrical', 
    priority: 'High', 
    status: 'Open', 
    createdDate: '2024-12-16', 
    assignedTo: 'Mike Wilson', 
    location: 'Building B - Basement', 
    description: 'Routine electrical inspection needed' 
  },
  { 
    id: 'WO-003', 
    title: 'Plumbing Leak Repair', 
    category: 'Plumbing', 
    priority: 'Medium', 
    status: 'Completed', 
    createdDate: '2024-12-14', 
    assignedTo: 'Sarah Johnson', 
    location: 'Building C - Floor 2', 
    description: 'Water leak in restroom' 
  },
  { 
    id: 'WO-004', 
    title: 'Fire Alarm Testing', 
    category: 'Fire Safety', 
    priority: 'High', 
    status: 'Open', 
    createdDate: '2024-12-17', 
    assignedTo: 'John Tech', 
    location: 'Building A - All Floors', 
    description: 'Monthly fire alarm system test' 
  },
  { 
    id: 'WO-005', 
    title: 'Lighting Fixture Replacement', 
    category: 'Electrical', 
    priority: 'Low', 
    status: 'In Progress', 
    createdDate: '2024-12-13', 
    assignedTo: 'Mike Wilson', 
    location: 'Building D - Floor 1', 
    description: 'Replace broken LED fixtures' 
  },
  { 
    id: 'WO-006', 
    title: 'Air Filter Maintenance', 
    category: 'HVAC', 
    priority: 'Medium', 
    status: 'Open', 
    createdDate: '2024-12-18', 
    assignedTo: 'John Tech', 
    location: 'Building E - Floor 2', 
    description: 'Replace air filters in main HVAC system' 
  }
];