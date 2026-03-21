<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useApi } from "@/composables/useApi";

const api = useApi();
const status = ref<string>("checking...");

onMounted(async () => {
  try {
    const data = await api.get<{ status: string }>("/api/health");
    status.value = data.status;
  } catch {
    status.value = "API not running — start it with: bun run dev";
  }
});
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Prototype Home</h1>
      <p class="mt-1 text-gray-500">API status: {{ status }}</p>
    </div>

    <div class="rounded-lg border border-gray-200 bg-white p-6">
      <h2 class="text-lg font-semibold">Getting Started</h2>
      <p class="mt-2 text-sm text-gray-600">
        Describe what you want to build to Claude. It will create pages, API
        routes, database tables, and calculations following Valur's patterns.
      </p>
    </div>
  </div>
</template>
