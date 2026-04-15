<template>
  <div class="min-h-screen bg-background font-sans antialiased">
    <router-view />
    <Toaster position="top-right" richColors duration="4000" />
  </div>
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner';
</script>
