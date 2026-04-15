import { defineStore } from 'pinia';
import { columnService } from '@/services/column.service';
import type { Column } from '@/types';
import { notify } from '@/services/notification.service';

import {
  normalizeColumns,
  reindexColumns,
  extractOrderUpdates,
} from '@/domain/column.domain';

export const useColumnStore = defineStore('column', {
  state: () => ({
    columns: [] as Column[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchColumns(kanbanId: number) {
      this.loading = true;

      try {
        const { data } = await columnService.getByKanban(kanbanId);

        // domain responsibility
        this.columns = normalizeColumns(data);
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to fetch columns';
        if (this.error) notify.error(this.error);
      } finally {
        this.loading = false;
      }
    },

    async createColumn(kanbanId: number, data: Partial<Column>) {
      try {
        const response = await columnService.create(kanbanId, {
          ...data,
          order: this.columns.length,
        });

        this.columns.push(response.data);

        notify.success('Column added');

        return response.data;
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to create column';
        if (this.error) notify.error(this.error);
        throw err;
      }
    },

    async updateColumn(id: number, data: Partial<Column>) {
      const index = this.columns.findIndex((c) => c.id === id);
      const snapshot = index !== -1 ? { ...this.columns[index] } : null;

      // optimistic update
      if (index !== -1) {
        this.columns[index] = {
          ...this.columns[index],
          ...data,
        };
      }

      try {
        const { data: updated } = await columnService.update(id, data);

        if (index !== -1) {
          this.columns[index] = updated;
        }

        notify.success('Column updated');
      } catch (err: any) {
        // rollback
        if (index !== -1 && snapshot) {
          this.columns[index] = snapshot;
        }

        this.error = err?.message ?? 'Failed to update column';
        if (this.error) notify.error(this.error);
        throw err;
      }
    },

    async deleteColumn(id: number) {
      try {
        await columnService.delete(id);

        // remove
        this.columns = this.columns.filter((c) => c.id !== id);

        // reindex via domain
        this.columns = reindexColumns(this.columns);

        // sync backend order
        await columnService.reorder(extractOrderUpdates(this.columns));

        notify.error('Column deleted');
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to delete column';
        if (this.error) notify.error(this.error);
        throw err;
      }
    },

    async updateColumnsOrder(newColumns: Column[]) {
      const snapshot = [...this.columns];

      // optimistic reorder via domain
      this.columns = reindexColumns(newColumns);

      try {
        await columnService.reorder(extractOrderUpdates(this.columns));
      } catch (err: any) {
        // rollback strict
        this.columns = snapshot;

        this.error = err?.message ?? 'Failed to reorder columns';
        if (this.error) notify.error(this.error);
      }
    },
  },
});
