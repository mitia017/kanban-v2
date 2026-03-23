<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useTaskStore } from '@/stores/task';
import { useColumnStore } from '@/stores/column';
import type { Column } from '@/types';
import { MoreHorizontal, Plus, Trash2, GripVertical } from 'lucide-vue-next';
import Button from '@/components/ui/Button.vue';
import EditableTitle from '@/components/ui/EditableTitle.vue';
import TaskCard from '@/components/task/TaskCard.vue';
import Skeleton from '@/components/ui/Skeleton.vue';
import draggable from 'vuedraggable';

const props = defineProps<{
  column: Column;
}>();

const taskStore = useTaskStore();
const columnStore = useColumnStore();

onMounted(async () => {
  await taskStore.fetchTasks(props.column.id);
});

const tasks = computed({
  get: () => taskStore.tasks[props.column.id] || [],
  set: (value) => {
    // This is handled by vuedraggable and the moveTask action
    // But we need a setter for v-model
  },
});

const handleAddTask = async () => {
  await taskStore.createTask(props.column.id, {
    title: 'New Task',
    order: tasks.value.length,
    priority: 'medium',
  });
};

const updateColumnTitle = async (newTitle: string) => {
  await columnStore.updateColumn(props.column.id, { title: newTitle });
};

const handleDeleteColumn = async () => {
  if (
    confirm('Are you sure you want to delete this column and all its tasks?')
  ) {
    await columnStore.deleteColumn(props.column.id);
  }
};

const onDragChange = (evt: any) => {
  if (evt.added) {
    const { element, newIndex } = evt.added;
    taskStore.moveTask(
      element.id,
      element.column_id,
      props.column.id,
      newIndex
    );
  } else if (evt.moved) {
    const { element, newIndex } = evt.moved;
    taskStore.moveTask(element.id, props.column.id, props.column.id, newIndex);
  }
};
</script>

<template>
  <div
    class="w-80 flex-none flex flex-col max-h-full bg-[#b9a4e6] rounded-2xl border border-slate-200 shadow-sm group/column"
  >
    <!-- Column Header -->
    <div
      class="p-4 flex items-center justify-between column-handle cursor-grab active:cursor-grabbing"
    >
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <GripVertical
          class="w-4 h-4 text-slate-400 opacity-0 group-hover/column:opacity-100 transition-opacity"
        />
        <EditableTitle
          v-model="props.column.title"
          as="h3"
          class="font-bold text-slate-700"
          @change="updateColumnTitle"
        />
        <span
          class="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full"
        >
          {{ tasks.length }}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8 text-blue-900 hover:text-destructive"
        @click="handleDeleteColumn"
      >
        <Trash2 class="w-4 h-4" />
      </Button>
    </div>

    <!-- Tasks List -->
    <div class="flex-1 overflow-y-auto min-h-[50px] px-3 pb-4">
      <draggable
        v-model="tasks"
        group="tasks"
        item-key="id"
        class="flex flex-col gap-3 h-full"
        ghost-class="opacity-50"
        drag-class="rotate-2"
        :animation="200"
        @change="onDragChange"
      >
        <template #item="{ element }">
          <TaskCard :task="element" />
        </template>
      </draggable>
    </div>

    <!-- Column Footer -->
    <div class="p-3 mt-auto">
      <Button
        variant="ghost"
        class="w-full justify-start text-slate-950 hover:text-blue-900 hover:bg-primary/5 rounded-xl font-medium"
        @click="handleAddTask"
      >
        <Plus class="w-4 h-4 mr-2" />
        Add Task
      </Button>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for task list */
.overflow-y-auto::-webkit-scrollbar {
  width: 5px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
</style>
