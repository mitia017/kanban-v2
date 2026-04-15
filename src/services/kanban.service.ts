import api from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { Kanban } from '@/types';

export const kanbanService = {
  async getAll() {
    const res = await api.get<Kanban[]>(API_ENDPOINTS.KANBANS);
    return res;
  },

  async getOne(id: number) {
    const res = await api.get<Kanban>(`${API_ENDPOINTS.KANBANS}/${id}`);
    return res;
  },

  async create(data: Partial<Kanban>) {
    const res = await api.post<Kanban>(API_ENDPOINTS.KANBANS, data);
    return res;
  },

  async update(id: number, data: Partial<Kanban>) {
    const res = await api.put<Kanban>(`${API_ENDPOINTS.KANBANS}/${id}`, data);
    return res;
  },

  async delete(id: number) {
    return api.delete(`${API_ENDPOINTS.KANBANS}/${id}`);
  },
};
