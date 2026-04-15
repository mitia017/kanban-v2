<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useKanbanStore } from '@/stores/kanban';
import { useColumnStore } from '@/stores/column';
import { ArrowLeft, Plus, Settings } from 'lucide-vue-next';
import Button from '@/components/ui/Button.vue';
import EditableTitle from '@/components/ui/EditableTitle.vue';
import ColumnComponent from '@/components/column/Column.vue';
import Skeleton from '@/components/ui/Skeleton.vue';
import draggable from 'vuedraggable';

const route = useRoute();
const router = useRouter();
const kanbanStore = useKanbanStore();
const columnStore = useColumnStore();

const kanbanId = computed(() => Number(route.params.id));

onMounted(async () => {
  await Promise.all([
    kanbanStore.fetchKanban(kanbanId.value),
    columnStore.fetchColumns(kanbanId.value),
  ]);
});

const columns = computed(() => columnStore.columns);

const handleColumnDrag = async (evt: any) => {
  const moved = evt.added || evt.moved;
  if (!moved) return;

  await columnStore.updateColumnsOrder(columnStore.columns);
};

const handleAddColumn = async () => {
  await columnStore.createColumn(kanbanId.value, {
    title: 'New Column',
    order: columnStore.columns.length,
  });
};

const updateBoardTitle = async (newTitle: string) => {
  await kanbanStore.updateKanban(kanbanId.value, { title: newTitle });
};

const goBack = () => router.push({ name: 'kanban-list' });
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden bg-[#f8fafc]">
    <header
      class="flex-none h-16 border-b bg-white/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm"
    >
      <div class="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          @click="goBack"
          class="rounded-full"
        >
          <ArrowLeft class="w-5 h-5" />
        </Button>

        <div v-if="kanbanStore.currentKanban" class="flex-1 max-w-md">
          <EditableTitle
            v-model="kanbanStore.currentKanban.title"
            as="h1"
            class="text-xl font-bold"
            @change="updateBoardTitle"
          />
        </div>

        <Skeleton v-else class="h-8 w-48" />
      </div>

      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" class="rounded-xl">
          <Settings class="w-4 h-4 mr-2" />
          Board Settings
        </Button>

        <Button
          size="sm"
          class="rounded-xl shadow-md bg-[#36868d] text-gray-100 hover:bg-[#49b4be] hover:text-slate-50"
          @click="handleAddColumn"
        >
          <Plus class="w-4 h-4 mr-2" />
          Add Column
        </Button>
      </div>
    </header>
    <main class="flex-1 overflow-x-auto overflow-y-hidden p-6">
      <div
        v-if="columnStore.loading && columnStore.columns.length === 0"
        class="flex gap-6 h-full"
      >
        <Skeleton
          v-for="i in 3"
          :key="i"
          class="w-80 h-full rounded-2xl flex-none"
        />
      </div>

      <div v-else class="h-full">
        <draggable
          :list="columns"
          item-key="id"
          class="flex gap-6 h-full items-start"
          handle=".column-handle"
          ghost-class="opacity-50"
          :animation="200"
          @change="handleColumnDrag"
        >
          <template #item="{ element }">
            <ColumnComponent :column="element" />
          </template>

          <template #footer>
            <button
              @click="handleAddColumn"
              class="w-80 flex-none h-14 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-500 hover:border-[#b9a4e6] hover:text-[#b9a4e6] transition-all bg-white/50 hover:bg-white"
            >
              <Plus class="w-5 h-5 mr-2" />
              <span class="font-medium">Add another column</span>
            </button>
          </template>
        </draggable>
      </div>
    </main>
  </div>
</template>
