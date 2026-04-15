import api from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { Task } from '@/types';

export const taskService = {
  async getByColumn(columnId: number) {
    const res = await api.get<Task[]>(
      `${API_ENDPOINTS.COLUMNS}/${columnId}/tasks`
    );
    return res;
  },

  async create(columnId: number, data: Partial<Task>) {
    const res = await api.post<Task>(
      `${API_ENDPOINTS.COLUMNS}/${columnId}/tasks`,
      data
    );
    return res;
  },

  async update(id: number, data: Partial<Task>) {
    const res = await api.put<Task>(`${API_ENDPOINTS.TASKS}/${id}`, data);
    return res;
  },

  async delete(id: number) {
    return api.delete(`${API_ENDPOINTS.TASKS}/${id}`);
  },

  async reorder(updates: { id: number; column_id: number; order: number }[]) {
    return api.patch(`${API_ENDPOINTS.TASKS}/reorder`, {
      tasks: updates,
    });
  },
};
