import { defineStore } from 'pinia';
import { taskService } from '@/api/services';
import type { Task } from '@/types';
import { toast } from 'vue-sonner';

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: {} as Record<number, Task[]>,
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
        const order = (this.tasks[columnId] || []).length;
        const response = await taskService.create(columnId, { ...data, order });
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
      const index = (this.tasks[currentColumnId] || []).findIndex(
        (t) => t.id === id
      );
      const originalTask =
        index !== -1 ? { ...this.tasks[currentColumnId][index] } : null;

      if (index !== -1) {
        this.tasks[currentColumnId][index] = {
          ...this.tasks[currentColumnId][index],
          ...data,
        };
      }

      try {
        const response = await taskService.update(id, data);
        if (index !== -1) this.tasks[currentColumnId][index] = response.data;
        toast.success('Task updated');
      } catch (err: any) {
        if (index !== -1 && originalTask)
          this.tasks[currentColumnId][index] = originalTask;
        this.error = err.message || 'Failed to update task';
        toast.error(this.error || 'Error');
        throw err;
      }
    },

    async moveTask(
      id: number,
      fromColumnId: number,
      toColumnId: number,
      newIndex: number
    ) {
      const task = this.tasks[fromColumnId]?.find((t) => t.id === id);
      if (!task) return;

      // Snapshot pour rollback
      const snapshotFrom = [...(this.tasks[fromColumnId] || [])];
      const snapshotTo = [...(this.tasks[toColumnId] || [])];

      // 1. Optimistic UI update
      this.tasks[fromColumnId] = (this.tasks[fromColumnId] || []).filter(
        (t) => t.id !== id
      );
      if (!this.tasks[toColumnId]) this.tasks[toColumnId] = [];
      this.tasks[toColumnId].splice(newIndex, 0, {
        ...task,
        column_id: toColumnId,
      });

      // 2. Recalcul des orders dans les deux colonnes
      this.tasks[fromColumnId] = this.tasks[fromColumnId].map((t, i) => ({
        ...t,
        order: i,
      }));
      this.tasks[toColumnId] = this.tasks[toColumnId].map((t, i) => ({
        ...t,
        order: i,
      }));

      // 3. Batch update → Laravel (un seul appel)
      try {
        const updates: { id: number; column_id: number; order: number }[] = [];

        this.tasks[fromColumnId].forEach((t) =>
          updates.push({ id: t.id, column_id: fromColumnId, order: t.order })
        );

        if (toColumnId !== fromColumnId) {
          this.tasks[toColumnId].forEach((t) =>
            updates.push({ id: t.id, column_id: toColumnId, order: t.order })
          );
        }

        await taskService.reorder(updates);
      } catch (err: any) {
        // Rollback si erreur
        this.tasks[fromColumnId] = snapshotFrom;
        this.tasks[toColumnId] = snapshotTo;
        this.error = err.message || 'Failed to move task';
        toast.error(this.error || 'Error');
      }
    },

    async deleteTask(id: number, columnId: number) {
      try {
        await taskService.delete(id);
        this.tasks[columnId] = (this.tasks[columnId] || []).filter(
          (t) => t.id !== id
        );

        // Recalcul des orders après suppression
        this.tasks[columnId] = this.tasks[columnId].map((t, i) => ({
          ...t,
          order: i,
        }));

        const updates = this.tasks[columnId].map((t) => ({
          id: t.id,
          column_id: columnId,
          order: t.order,
        }));
        if (updates.length > 0) await taskService.reorder(updates);

        toast.success('Task deleted');
      } catch (err: any) {
        this.error = err.message || 'Failed to delete task';
        toast.error(this.error || 'Error');
        throw err;
      }
    },
  },
});
