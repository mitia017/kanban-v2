import api from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { Column } from '@/types';

export const columnService = {
  async getByKanban(kanbanId: number) {
    const res = await api.get<Column[]>(
      `${API_ENDPOINTS.KANBANS}/${kanbanId}/columns`
    );
    return res;
  },

  async create(kanbanId: number, data: Partial<Column>) {
    const res = await api.post<Column>(
      `${API_ENDPOINTS.KANBANS}/${kanbanId}/columns`,
      data
    );
    return res;
  },

  async update(id: number, data: Partial<Column>) {
    const res = await api.put<Column>(`${API_ENDPOINTS.COLUMNS}/${id}`, data);
    return res;
  },

  async delete(id: number) {
    return api.delete(`${API_ENDPOINTS.COLUMNS}/${id}`);
  },

  async reorder(updates: { id: number; order: number }[]) {
    return api.patch(`${API_ENDPOINTS.COLUMNS}/reorder`, {
      columns: updates,
    });
  },
};
