<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
  modelValue: string;
  as?: string;
  class?: string;
  inputClass?: string;
  autoFocus?: boolean;
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
}>();

const isEditing = ref(false);
const inputValue = ref(props.modelValue);
const inputRef = ref<HTMLInputElement | null>(null);

watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = newValue;
  }
);

const startEditing = () => {
  isEditing.value = true;
  nextTick(() => {
    inputRef.value?.focus();
    inputRef.value?.select();
  });
};

const stopEditing = () => {
  if (!isEditing.value) return;
  isEditing.value = false;
  if (inputValue.value !== props.modelValue) {
    emits('update:modelValue', inputValue.value);
    emits('change', inputValue.value);
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    stopEditing();
  } else if (e.key === 'Escape') {
    inputValue.value = props.modelValue;
    isEditing.value = false;
  }
};
</script>

<template>
  <div :class="cn('inline-block w-full', props.class)">
    <div
      v-if="!isEditing"
      class="cursor-pointer hover:bg-accent/50 rounded px-1 -ml-1 transition-colors min-h-[1.5em] flex items-center"
      @click="startEditing"
    >
      <component :is="as || 'span'" class="truncate">
        {{ modelValue || 'Click to edit' }}
      </component>
    </div>
    <input
      v-else
      ref="inputRef"
      v-model="inputValue"
      type="text"
      :class="
        cn(
          'w-full bg-background border-2 border-primary rounded px-1 -ml-1 outline-none focus:ring-0',
          inputClass
        )
      "
      @blur="stopEditing"
      @keydown="handleKeyDown"
    />
  </div>
</template>
