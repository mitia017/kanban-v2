import { defineStore } from 'pinia';
import { columnService } from '@/api/services';
import type { Column } from '@/types';
import { toast } from 'vue-sonner';

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
        const response = await columnService.getByKanban(kanbanId);
        this.columns = response.data.sort((a, b) => a.order - b.order);
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch columns';
        toast.error(this.error || 'Error');
      } finally {
        this.loading = false;
      }
    },
    async createColumn(kanbanId: number, data: Partial<Column>) {
      try {
        const response = await columnService.create(kanbanId, data);
        this.columns.push(response.data);
        toast.success('Column added');
        return response.data;
      } catch (err: any) {
        this.error = err.message || 'Failed to create column';
        toast.error(this.error || 'Error');
        throw err;
      }
    },
    async updateColumn(id: number, data: Partial<Column>) {
      const originalColumn = this.columns.find(c => c.id === id);
      const index = this.columns.findIndex(c => c.id === id);
      if (index !== -1) {
        this.columns[index] = { ...this.columns[index], ...data };
      }

      try {
        const response = await columnService.update(id, data);
        if (index !== -1) this.columns[index] = response.data;
      } catch (err: any) {
        if (index !== -1 && originalColumn) this.columns[index] = originalColumn;
        this.error = err.message || 'Failed to update column';
        toast.error(this.error || 'Error');
        throw err;
      }
    },
    async deleteColumn(id: number) {
      try {
        await columnService.delete(id);
        this.columns = this.columns.filter(c => c.id !== id);
        toast.success('Column deleted');
      } catch (err: any) {
        this.error = err.message || 'Failed to delete column';
        toast.error(this.error || 'Error');
        throw err;
      }
    },
    updateColumnsOrder(newColumns: Column[]) {
      this.columns = newColumns;
      newColumns.forEach((col, index) => {
        if (col.order !== index) {
          this.updateColumn(col.id, { order: index });
        }
      });
    }
  }
});
