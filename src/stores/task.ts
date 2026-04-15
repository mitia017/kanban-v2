import { defineStore } from 'pinia';
import { taskService } from '@/services/task.service';
import type { Task } from '@/types';
import { notify } from '@/services/notification.service';

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
        const { data } = await taskService.getByColumn(columnId);

        this.tasks[columnId] = data.sort((a, b) => a.order - b.order);
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to fetch tasks';
        notify.error(this.error);
      } finally {
        this.loading = false;
      }
    },

    async createTask(columnId: number, data: Partial<Task>) {
      try {
        const order = (this.tasks[columnId] || []).length;

        const { data: created } = await taskService.create(columnId, {
          ...data,
          order,
        });

        if (!this.tasks[columnId]) this.tasks[columnId] = [];

        this.tasks[columnId].push(created);

        notify.success('Task created');

        return created;
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to create task';
        notify.error(this.error);
        throw err;
      }
    },

    async updateTask(id: number, data: Partial<Task>, columnId: number) {
      const index = (this.tasks[columnId] || []).findIndex((t) => t.id === id);

      const snapshot = index !== -1 ? { ...this.tasks[columnId][index] } : null;

      if (index !== -1) {
        this.tasks[columnId][index] = {
          ...this.tasks[columnId][index],
          ...data,
        };
      }

      try {
        const { data: updated } = await taskService.update(id, data);

        if (index !== -1) {
          this.tasks[columnId][index] = updated;
        }

        notify.success('Task updated');
      } catch (err: any) {
        if (index !== -1 && snapshot) {
          this.tasks[columnId][index] = snapshot;
        }

        this.error = err?.message ?? 'Failed to update task';
        notify.error(this.error);
        throw err;
      }
    },

    async deleteTask(id: number, columnId: number) {
      try {
        await taskService.delete(id);

        this.tasks[columnId] = (this.tasks[columnId] || []).filter(
          (t) => t.id !== id
        );

        this.tasks[columnId] = this.tasks[columnId].map((t, i) => ({
          ...t,
          order: i,
        }));

        await taskService.reorder(
          this.tasks[columnId].map((t) => ({
            id: t.id,
            column_id: columnId,
            order: t.order,
          }))
        );

        notify.error('Task deleted');
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to delete task';
        notify.error(this.error);
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

      const snapshotFrom = [...(this.tasks[fromColumnId] || [])];
      const snapshotTo = [...(this.tasks[toColumnId] || [])];

      // optimistic move
      this.tasks[fromColumnId] = (this.tasks[fromColumnId] || []).filter(
        (t) => t.id !== id
      );

      if (!this.tasks[toColumnId]) this.tasks[toColumnId] = [];

      this.tasks[toColumnId].splice(newIndex, 0, {
        ...task,
        column_id: toColumnId,
      });

      // normalize orders
      this.tasks[fromColumnId] = this.tasks[fromColumnId].map((t, i) => ({
        ...t,
        order: i,
      }));

      this.tasks[toColumnId] = this.tasks[toColumnId].map((t, i) => ({
        ...t,
        order: i,
      }));

      try {
        const updates: any[] = [];

        this.tasks[fromColumnId].forEach((t) =>
          updates.push({
            id: t.id,
            column_id: fromColumnId,
            order: t.order,
          })
        );

        if (toColumnId !== fromColumnId) {
          this.tasks[toColumnId].forEach((t) =>
            updates.push({
              id: t.id,
              column_id: toColumnId,
              order: t.order,
            })
          );
        }

        await taskService.reorder(updates);
      } catch (err: any) {
        this.tasks[fromColumnId] = snapshotFrom;
        this.tasks[toColumnId] = snapshotTo;

        this.error = err?.message ?? 'Failed to move task';
        notify.error(this.error);
      }
    },
  },
});
