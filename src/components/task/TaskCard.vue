<script setup lang="ts">
import { ref } from 'vue';
import { useTaskStore } from '@/stores/task';
import type { Task } from '@/types';
import { Trash2, Edit2, Calendar } from 'lucide-vue-next';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Dialog from '@/components/ui/Dialog.vue';
import ConfirmModal from '@/components/ui/ConfirmModal.vue';

const props = defineProps<{
  task: Task;
}>();

const taskStore = useTaskStore();

const isDetailsOpen = ref(false);

const editTitle = ref(props.task.title);
const editDescription = ref(props.task.description || '');
const editPriority = ref(props.task.priority);

const showDeleteModal = ref(false);

const isUpdating = ref(false);

const confirmUpdateTask = async () => {
  if (isUpdating.value) return;

  isUpdating.value = true;

  try {
    await taskStore.updateTask(
      props.task.id,
      {
        title: editTitle.value,
        description: editDescription.value,
        priority: editPriority.value,
      },
      props.task.column_id
    );

    isDetailsOpen.value = false;
  } finally {
    isUpdating.value = false;
  }
};

const handleDelete = (e?: Event) => {
  e?.stopPropagation();
  showDeleteModal.value = true;
};

const confirmDeleteTask = async () => {
  await taskStore.deleteTask(props.task.id, props.task.column_id);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};
</script>

<template>
  <Card
    class="p-4 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-all shadow-sm hover:shadow-md bg-white rounded-sm border-slate-200 group/task"
  >
    <div class="flex justify-between items-start gap-2">
      <h4 class="text-sm font-semibold text-slate-800 leading-tight flex-1">
        {{ props.task.title }}
      </h4>

      <Button
        variant="ghost"
        size="icon"
        class="h-6 w-6 opacity-0 group-hover/task:opacity-100 transition-opacity text-blue-900 hover:text-yellow-300"
        @click="isDetailsOpen = true"
      >
        <Edit2 class="w-3.5 h-3.5 hover:shadow-sm" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        class="h-6 w-6 opacity-0 group-hover/task:opacity-100 transition-opacity text-blue-900 hover:text-destructive"
        @click.stop="handleDelete"
      >
        <Trash2 class="w-3.5 h-3.5 hover:shadow-sm" />
      </Button>
    </div>
    <p
      v-if="props.task.description"
      class="text-xs text-slate-500 mt-2 line-clamp-2"
    >
      {{ props.task.description }}
    </p>
    <div
      class="mt-4 flex items-center justify-between text-[10px] font-medium text-blue-600"
    >
      <div class="flex items-center">
        <Calendar class="w-3 h-3 mr-1" />
        {{ formatDate(props.task.created_at) }}
      </div>

      <div
        class="px-2 py-1 rounded-full font-bold text-xs"
        :class="{
          'text-red-600 bg-red-200': props.task.priority === 'high',
          'text-yellow-600 bg-yellow-200': props.task.priority === 'medium',
          'text-green-600 bg-green-200': props.task.priority === 'low',
        }"
      >
        {{ props.task.priority }}
      </div>
    </div>

    <Dialog
      v-model:open="isDetailsOpen"
      title="Task Details"
      description="View and edit task information."
    >
      <div class="space-y-4 py-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700">Title</label>
          <Input v-model="editTitle" placeholder="Task title..." />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700">Description</label>
          <textarea
            v-model="editDescription"
            class="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1"
            placeholder="Add a more detailed description..."
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700">Priority</label>
          <select
            v-model="editPriority"
            class="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      <div class="flex justify-between items-center mt-6">
        <Button
          variant="ghost"
          size="sm"
          class="text-destructive hover:bg-destructive/10"
          @click.stop="handleDelete"
        >
          <Trash2 class="w-4 h-4 mr-2" />
          Delete Task
        </Button>

        <div class="flex gap-3">
          <Button variant="outline" @click="isDetailsOpen = false">
            Cancel
          </Button>

          <Button @click="confirmUpdateTask" :disabled="isUpdating">
            Save Changes
          </Button>
        </div>
      </div>
    </Dialog>

    <ConfirmModal
      v-model="showDeleteModal"
      title="Delete task"
      message="Are you sure you want to delete this task?"
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="confirmDeleteTask"
    />
  </Card>
</template>
