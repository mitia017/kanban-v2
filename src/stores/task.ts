import { defineStore } from 'pinia';
import { taskService } from '@/api/services';
import type { Task } from '@/types';
import { toast } from 'vue-sonner';

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: {} as Record<number, Task[]>, // columnId -> Task[]
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchTasks(columnId: number) {
      this.loading = true;
      try {
        const response = await taskService.getByColumn(columnId);
        this.tasks[columnId] = response.data.sort((a, b) => a.order - b.order);
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch tasks';
        toast.error(this.error || 'Error');
      } finally {
        this.loading = false;
      }
    },
    async createTask(columnId: number, data: Partial<Task>) {
      try {
        const response = await taskService.create(columnId, data);
        if (!this.tasks[columnId]) this.tasks[columnId] = [];
        this.tasks[columnId].push(response.data);
        toast.success('Task created');
        return response.data;
      } catch (err: any) {
        this.error = err.message || 'Failed to create task';
        toast.error(this.error || 'Error');
        throw err;
      }
    },
    async updateTask(id: number, data: Partial<Task>, currentColumnId: number) {
      const index = (this.tasks[currentColumnId] || []).findIndex(t => t.id === id);
      const originalTask = index !== -1 ? this.tasks[currentColumnId][index] : null;

      if (index !== -1) {
        this.tasks[currentColumnId][index] = { ...this.tasks[currentColumnId][index], ...data };
      }

      try {
        const response = await taskService.update(id, data);
        if (index !== -1) this.tasks[currentColumnId][index] = response.data;
        toast.success('Task updated');
      } catch (err: any) {
        if (index !== -1 && originalTask) this.tasks[currentColumnId][index] = originalTask;
        this.error = err.message || 'Failed to update task';
        toast.error(this.error || 'Error');
        throw err;
      }
    },
    async moveTask(id: number, fromColumnId: number, toColumnId: number, newOrder: number) {
      const task = this.tasks[fromColumnId]?.find(t => t.id === id);
      if (!task) return;

      const updatedTask = { ...task, column_id: toColumnId, order: newOrder };
      this.tasks[fromColumnId] = (this.tasks[fromColumnId] || []).filter(t => t.id !== id);
      if (!this.tasks[toColumnId]) this.tasks[toColumnId] = [];
      this.tasks[toColumnId].splice(newOrder, 0, updatedTask);

      try {
        await taskService.update(id, { column_id: toColumnId, order: newOrder });
      } catch (err: any) {
        this.fetchTasks(fromColumnId);
        this.fetchTasks(toColumnId);
        this.error = err.message || 'Failed to move task';
        toast.error(this.error || 'Error');
      }
    },
    async deleteTask(id: number, columnId: number) {
      try {
        await taskService.delete(id);
        this.tasks[columnId] = (this.tasks[columnId] || []).filter(t => t.id !== id);
        toast.success('Task deleted');
      } catch (err: any) {
        this.error = err.message || 'Failed to delete task';
        toast.error(this.error || 'Error');
        throw err;
      }
    }
  }
});
