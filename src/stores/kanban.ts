import { defineStore } from 'pinia';
import { kanbanService } from '@/api/services';
import type { Kanban } from '@/types';
import { toast } from 'vue-sonner';

export const useKanbanStore = defineStore('kanban', {
  state: () => ({
    kanbans: [] as Kanban[],
    currentKanban: null as Kanban | null,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchKanbans() {
      this.loading = true;
      try {
        const response = await kanbanService.getAll();
        this.kanbans = response.data;
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch kanbans';
        toast.error(this.error || 'Error');
      } finally {
        this.loading = false;
      }
    },
    async fetchKanban(id: number) {
      this.loading = true;
      try {
        const response = await kanbanService.getOne(id);
        this.currentKanban = response.data;
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch kanban';
        toast.error(this.error || 'Error');
      } finally {
        this.loading = false;
      }
    },
    async createKanban(data: Partial<Kanban>) {
      try {
        const response = await kanbanService.create(data);
        this.kanbans.push(response.data);
        toast.success('Board created successfully');
        return response.data;
      } catch (err: any) {
        this.error = err.message || 'Failed to create kanban';
        toast.error(this.error || 'Error');
        throw err;
      }
    },
    async updateKanban(id: number, data: Partial<Kanban>) {
      try {
        const response = await kanbanService.update(id, data);
        const index = this.kanbans.findIndex(k => k.id === id);
        if (index !== -1) this.kanbans[index] = response.data;
        if (this.currentKanban?.id === id) this.currentKanban = response.data;
        toast.success('Board updated');
      } catch (err: any) {
        this.error = err.message || 'Failed to update kanban';
        toast.error(this.error || 'Error');
        throw err;
      }
    },
    async deleteKanban(id: number) {
      try {
        await kanbanService.delete(id);
        this.kanbans = this.kanbans.filter(k => k.id !== id);
        if (this.currentKanban?.id === id) this.currentKanban = null;
        toast.success('Board deleted');
      } catch (err: any) {
        this.error = err.message || 'Failed to delete kanban';
        toast.error(this.error || 'Error');
        throw err;
      }
    }
  }
});
