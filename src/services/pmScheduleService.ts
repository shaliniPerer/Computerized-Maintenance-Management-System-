import { api } from './api';
import { ENDPOINTS } from '../config/apiConfig';
import { PMSchedule, PMFormData } from '../types';

interface PMSchedulesResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: PMSchedule[];
}

interface PMScheduleResponse {
  success: boolean;
  data: PMSchedule;
}

interface PMFilters {
  frequency?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface CompleteTaskData {
  completionNotes: string;
  checklist?: Array<{
    item: string;
    completed: boolean;
  }>;
}

class PMScheduleService {
  async getAll(filters?: PMFilters): Promise<PMSchedulesResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    
    const url = `${ENDPOINTS.PM_SCHEDULES.BASE}${params.toString() ? `?${params.toString()}` : ''}`;
    return api.get<PMSchedulesResponse>(url);
  }

  async getById(id: string): Promise<PMScheduleResponse> {
    return api.get<PMScheduleResponse>(ENDPOINTS.PM_SCHEDULES.BY_ID(id));
  }

  async create(data: PMFormData): Promise<PMScheduleResponse> {
    return api.post<PMScheduleResponse>(ENDPOINTS.PM_SCHEDULES.BASE, data);
  }

  async update(id: string, data: Partial<PMFormData>): Promise<PMScheduleResponse> {
    return api.put<PMScheduleResponse>(ENDPOINTS.PM_SCHEDULES.BY_ID(id), data);
  }

  async completeTask(id: string, data: CompleteTaskData): Promise<PMScheduleResponse> {
    return api.post<PMScheduleResponse>(ENDPOINTS.PM_SCHEDULES.COMPLETE(id), data);
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    return api.delete(ENDPOINTS.PM_SCHEDULES.BY_ID(id));
  }
}

export const pmScheduleService = new PMScheduleService();