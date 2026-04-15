<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useKanbanStore } from '@/stores/kanban';
import { Plus, Trash2, Layout, ExternalLink } from 'lucide-vue-next';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Dialog from '@/components/ui/Dialog.vue';
import Skeleton from '@/components/ui/Skeleton.vue';
import ConfirmModal from '@/components/ui/ConfirmModal.vue';

const router = useRouter();
const kanbanStore = useKanbanStore();

const isCreateOpen = ref(false);
const newKanbanTitle = ref('');
const newKanbanDescription = ref('');

const showDeleteModal = ref(false);
const selectedKanbanId = ref<number | null>(null);

onMounted(async () => {
  await kanbanStore.fetchKanbans();
});

const handleCreate = async () => {
  if (!newKanbanTitle.value.trim()) return;

  try {
    await kanbanStore.createKanban({
      title: newKanbanTitle.value,
      description: newKanbanDescription.value,
    });

    isCreateOpen.value = false;
    newKanbanTitle.value = '';
    newKanbanDescription.value = '';
  } catch (err) {
    console.error(err);
  }
};

const handleDelete = (id: number, e: Event) => {
  e.stopPropagation();
  selectedKanbanId.value = id;
  showDeleteModal.value = true;
};

const confirmDeleteKanban = async () => {
  if (!selectedKanbanId.value) return;

  await kanbanStore.deleteKanban(selectedKanbanId.value);

  selectedKanbanId.value = null;
  showDeleteModal.value = false;
};
const openBoard = (id: number) => {
  router.push({ name: 'kanban-board', params: { id } });
};
</script>

<template>
  <div class="container py-10 max-w-6xl">
    <!-- HEADER -->
    <div class="flex items-center justify-between mb-10">
      <div>
        <h1
          class="text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3"
        >
          <Layout class="w-10 h-10 text-primary" />
          My Boards
        </h1>
        <p class="text-slate-500 mt-2">
          Manage your projects and stay organized.
        </p>
      </div>

      <Button
        @click="isCreateOpen = true"
        class="rounded-xl shadow-lg hover:translate-y-[-2px] transition-transform"
      >
        <Plus class="w-5 h-5 mr-2" />
        New Board
      </Button>
    </div>

    <div
      v-if="kanbanStore.loading"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <Skeleton v-for="i in 3" :key="i" class="h-48 rounded-2xl" />
    </div>

    <div
      v-else-if="kanbanStore.kanbans.length === 0"
      class="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200"
    >
      <div
        class="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4"
      >
        <Layout class="w-8 h-8 text-slate-400" />
      </div>
      <h3 class="text-xl font-semibold text-slate-900">No boards yet</h3>
      <p class="text-slate-500 mt-2 mb-6">
        Create your first kanban board to get started.
      </p>
      <Button @click="isCreateOpen = true" variant="outline">
        <Plus class="w-5 h-5 mr-2" />
        Create Board
      </Button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="kanban in kanbanStore.kanbans"
        :key="kanban.id"
        class="group relative h-48 p-6 flex flex-col justify-between hover:shadow-xl hover:border-primary/50 cursor-pointer transition-all duration-300 overflow-hidden"
        @click="openBoard(kanban.id)"
      >
        <div
          class="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Button
            variant="ghost"
            size="icon"
            class="text-slate-400 hover:text-destructive hover:bg-destructive/10 rounded-full"
            @click="handleDelete(kanban.id, $event)"
          >
            <Trash2 class="w-4 h-4" />
          </Button>
        </div>

        <div>
          <h2
            class="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors"
          >
            {{ kanban.title }}
          </h2>
          <p class="text-sm text-slate-500 mt-2 line-clamp-3">
            {{ kanban.description || 'No description' }}
          </p>
        </div>

        <div class="flex items-center text-primary font-medium text-sm mt-4">
          Open Board
          <ExternalLink
            class="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0"
          />
        </div>
      </Card>
    </div>

    <Dialog
      v-model:open="isCreateOpen"
      title="Create New Board"
      description="Start a new project board."
    >
      <div class="space-y-4 py-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Board Title</label>
          <Input v-model="newKanbanTitle" placeholder="Project name..." />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Description (optional)</label>
          <Input
            v-model="newKanbanDescription"
            placeholder="What is this board about?"
          />
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-4">
        <Button variant="outline" @click="isCreateOpen = false">
          Cancel
        </Button>
        <Button @click="handleCreate" :disabled="!newKanbanTitle.trim()">
          Create Board
        </Button>
      </div>
    </Dialog>

    <ConfirmModal
      v-model="showDeleteModal"
      title="Delete board"
      message="Are you sure you want to delete this board? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="confirmDeleteKanban"
    />
  </div>
</template>
