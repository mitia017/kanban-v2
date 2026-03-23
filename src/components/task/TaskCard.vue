<script setup lang="ts">
import { ref } from 'vue'
import { useTaskStore } from '@/stores/task'
import type { Task } from '@/types'
import { Trash2, Edit2, Calendar } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Dialog from '@/components/ui/Dialog.vue'

const props = defineProps<{
  task: Task
}>()

const taskStore = useTaskStore()
const isDetailsOpen = ref(false)
const editTitle = ref(props.task.title)
const editDescription = ref(props.task.description || '')

const handleUpdate = async () => {
  await taskStore.updateTask(props.task.id, {
    title: editTitle.value,
    description: editDescription.value
  }, props.task.column_id)
  isDetailsOpen.value = false
}

const handleDelete = async (e: Event) => {
  e.stopPropagation()
  if (confirm('Are you sure you want to delete this task?')) {
    await taskStore.deleteTask(props.task.id, props.task.column_id)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <Card
    class="p-4 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-all shadow-sm hover:shadow-md bg-white rounded-xl border-slate-200 group/task"
    @click="isDetailsOpen = true"
  >
    <div class="flex justify-between items-start gap-2">
      <h4 class="text-sm font-semibold text-slate-800 leading-tight flex-1">
        {{ props.task.title }}
      </h4>
      <Button
        variant="ghost"
        size="icon"
        class="h-6 w-6 opacity-0 group-hover/task:opacity-100 transition-opacity text-slate-400 hover:text-destructive"
        @click="handleDelete"
      >
        <Trash2 class="w-3.5 h-3.5" />
      </Button>
    </div>

    <p v-if="props.task.description" class="text-xs text-slate-500 mt-2 line-clamp-2">
      {{ props.task.description }}
    </p>

    <div class="mt-4 flex items-center justify-between text-[10px] font-medium text-slate-400">
      <div class="flex items-center">
        <Calendar class="w-3 h-3 mr-1" />
        {{ formatDate(props.task.created_at) }}
      </div>
    </div>

    <Dialog v-model:open="isDetailsOpen" title="Task Details" description="View and edit task information.">
      <div class="space-y-4 py-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700">Title</label>
          <Input v-model="editTitle" placeholder="Task title..." />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700">Description</label>
          <textarea
            v-model="editDescription"
            class="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Add a more detailed description..."
          ></textarea>
        </div>
      </div>
      <div class="flex justify-between items-center mt-6">
        <Button variant="ghost" size="sm" class="text-destructive hover:bg-destructive/10" @click="handleDelete">
          <Trash2 class="w-4 h-4 mr-2" />
          Delete Task
        </Button>
        <div class="flex gap-3">
          <Button variant="outline" @click="isDetailsOpen = false">Cancel</Button>
          <Button @click="handleUpdate">Save Changes</Button>
        </div>
      </div>
    </Dialog>
  </Card>
</template>
