import { defineStore } from 'pinia';
import { kanbanService } from '@/services/kanban.service';
import type { Kanban } from '@/types';
import { notify } from '@/services/notification.service';

export const useKanbanStore = defineStore('kanban', {
  state: () => ({
    kanbans: [] as Kanban[],
    currentKanban: null as Kanban | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    setError(message: string) {
      this.error = message;
    },

    clearError() {
      this.error = null;
    },

    async fetchKanbans() {
      this.loading = true;
      this.clearError();

      try {
        const { data } = await kanbanService.getAll();
        this.kanbans = data;
      } catch (err: any) {
        this.setError(err?.message ?? 'Failed to fetch kanbans');
        notify.error(this.error as string);
      } finally {
        this.loading = false;
      }
    },

    async fetchKanban(id: number) {
      this.loading = true;
      this.clearError();

      try {
        const { data } = await kanbanService.getOne(id);
        this.currentKanban = data;
      } catch (err: any) {
        this.setError(err?.message ?? 'Failed to fetch kanban');
        notify.error(this.error as string);
      } finally {
        this.loading = false;
      }
    },

    async createKanban(payload: Partial<Kanban>) {
      this.clearError();

      try {
        const { data } = await kanbanService.create(payload);
        this.kanbans.push(data);

        notify.success('Board created successfully');
        return data;
      } catch (err: any) {
        this.setError(err?.message ?? 'Failed to create kanban');
        notify.error(this.error as string);
        throw err;
      }
    },

    async updateKanban(id: number, payload: Partial<Kanban>) {
      this.clearError();

      try {
        const { data } = await kanbanService.update(id, payload);

        const index = this.kanbans.findIndex((k) => k.id === id);

        if (index !== -1) {
          this.kanbans[index] = data;
        }

        if (this.currentKanban?.id === id) {
          this.currentKanban = data;
        }

        notify.success('Board updated');
        return data;
      } catch (err: any) {
        this.setError(err?.message ?? 'Failed to update kanban');
        notify.error(this.error as string);
        throw err;
      }
    },

    async deleteKanban(id: number) {
      this.clearError();

      try {
        await kanbanService.delete(id);

        this.kanbans = this.kanbans.filter((k) => k.id !== id);

        if (this.currentKanban?.id === id) {
          this.currentKanban = null;
        }

        notify.error('Board deleted');
      } catch (err: any) {
        this.setError(err?.message ?? 'Failed to delete kanban');
        notify.error(this.error as string);
        throw err;
      }
    },
  },
});
