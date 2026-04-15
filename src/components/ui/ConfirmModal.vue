<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const close = () => {
  emit('update:modelValue', false);
  emit('cancel');
};

const confirm = () => {
  emit('confirm');
  emit('update:modelValue', false);
};
</script>

<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
  >
    <div class="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
      <h2 class="text-lg font-bold text-slate-800 mb-2">
        {{ title || 'Confirmation' }}
      </h2>

      <p class="text-slate-600 mb-6">
        {{ message || 'Are you sure you want to continue ?' }}
      </p>

      <div class="flex justify-end gap-3">
        <button
          class="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300"
          @click="close"
        >
          {{ cancelText || 'Cancel' }}
        </button>

        <button
          class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          @click="confirm"
        >
          {{ confirmText || 'Delete' }}
        </button>
      </div>
    </div>
  </div>
</template>
