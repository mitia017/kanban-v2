import api from './client';
import type { Kanban, Column, Task } from '@/types';

export const kanbanService = {
  getAll: () => api.get<Kanban[]>('/kanbans'),
  getOne: (id: number) => api.get<Kanban>(`/kanbans/${id}`),
  create: (data: Partial<Kanban>) => api.post<Kanban>('/kanbans', data),
  update: (id: number, data: Partial<Kanban>) => api.put<Kanban>(`/kanbans/${id}`, data),
  delete: (id: number) => api.delete(`/kanbans/${id}`),
};

export const columnService = {
  getByKanban: (kanbanId: number) => api.get<Column[]>(`/kanbans/${kanbanId}/columns`),
  create: (kanbanId: number, data: Partial<Column>) => api.post<Column>(`/kanbans/${kanbanId}/columns`, data),
  update: (id: number, data: Partial<Column>) => api.put<Column>(`/columns/${id}`, data),
  delete: (id: number) => api.delete(`/columns/${id}`),
};

export const taskService = {
  getByColumn: (columnId: number) => api.get<Task[]>(`/columns/${columnId}/tasks`),
  create: (columnId: number, data: Partial<Task>) => api.post<Task>(`/columns/${columnId}/tasks`, data),
  update: (id: number, data: Partial<Task>) => api.put<Task>(`/tasks/${id}`, data),
  delete: (id: number) => api.delete(`/tasks/${id}`),
};
