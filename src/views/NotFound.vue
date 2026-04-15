<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Home, ArrowLeft } from 'lucide-vue-next';

const router = useRouter();

const goHome = () => {
  router.push({ name: 'kanban-list' });
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#f8fafc] px-6">
    <div class="text-center max-w-md">
      <!-- Illustration -->
      <div class="mb-6">
        <div class="text-4xl text-slate-800 font-extrabold">404</div>
        <div class="font-semibold text-4xl text-slate-600 mt-2">
          Page introuvable
        </div>
        <p class="text-sm text-slate-500 mt-3">
          La page que vous recherchez n’existe pas ou a été déplacée.
        </p>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center mt-8">
        <button
          @click="goHome"
          class="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#b9a4e6] text-slate-900 font-medium hover:bg-[#a17de0] transition"
        >
          <Home class="w-4 h-4" />
          Retour au tableau
        </button>

        <button
          @click="goBack"
          class="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
        >
          <ArrowLeft class="w-4 h-4" />
          Retour
        </button>
      </div>
    </div>
  </div>
</template>
