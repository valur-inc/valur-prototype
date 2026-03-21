<script setup lang="ts">
import { RouterView, RouterLink } from "vue-router";
</script>

<template>
  <div class="min-h-screen">
    <nav class="border-b border-gray-200 bg-white px-6 py-4">
      <div class="mx-auto flex max-w-5xl items-center gap-6">
        <span class="text-lg font-semibold text-primary-600">Valur Prototype</span>
        <RouterLink to="/" class="text-sm text-gray-600 hover:text-gray-900">Home</RouterLink>
      </div>
    </nav>
    <main class="mx-auto max-w-5xl px-6 py-8">
      <RouterView />
    </main>
  </div>
</template>
