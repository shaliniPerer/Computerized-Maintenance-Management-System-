import { api } from './api';
import { ENDPOINTS } from '../config/apiConfig';
import { WorkOrder, WorkOrderFormData } from '../types';

interface WorkOrdersResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: WorkOrder[];
}

interface WorkOrderResponse {
  success: boolean;
  data: WorkOrder;
}

interface WorkOrderFilters {
  category?: string;
  priority?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

class WorkOrderService {
  async getAll(filters?: WorkOrderFilters): Promise<WorkOrdersResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    
    const url = `${ENDPOINTS.WORK_ORDERS.BASE}${params.toString() ? `?${params.toString()}` : ''}`;
    return api.get<WorkOrdersResponse>(url);
  }

  async getById(id: string): Promise<WorkOrderResponse> {
    return api.get<WorkOrderResponse>(ENDPOINTS.WORK_ORDERS.BY_ID(id));
  }

  async create(data: WorkOrderFormData): Promise<WorkOrderResponse> {
    return api.post<WorkOrderResponse>(ENDPOINTS.WORK_ORDERS.BASE, data);
  }

  async update(id: string, data: Partial<WorkOrderFormData>): Promise<WorkOrderResponse> {
    return api.put<WorkOrderResponse>(ENDPOINTS.WORK_ORDERS.BY_ID(id), data);
  }

  async updateStatus(id: string, status: string): Promise<WorkOrderResponse> {
    return api.patch<WorkOrderResponse>(ENDPOINTS.WORK_ORDERS.STATUS(id), { status });
  }

  async addNote(id: string, text: string): Promise<WorkOrderResponse> {
    return api.post<WorkOrderResponse>(ENDPOINTS.WORK_ORDERS.NOTES(id), { text });
  }

  async uploadAttachment(id: string, file: File): Promise<WorkOrderResponse> {
    return api.uploadFile<WorkOrderResponse>(ENDPOINTS.WORK_ORDERS.ATTACHMENTS(id), file);
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    return api.delete(ENDPOINTS.WORK_ORDERS.BY_ID(id));
  }
}

export const workOrderService = new WorkOrderService();