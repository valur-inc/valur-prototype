/**
 * Example Pinia store.
 *
 * Production mapping: Each Pinia store maps to a namespaced Vuex module
 * in the real frontend's src/store/ directory.
 *
 * Pinia setup stores → Vuex modules with state/getters/actions/mutations
 */
import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useApi } from "@/composables/useApi";

// Example: a store for managing items from the API
export const useExampleStore = defineStore("example", () => {
  const api = useApi();
  const items = ref<Array<{ id: number; name: string }>>([]);
  const loading = ref(false);

  const count = computed(() => items.value.length);

  async function fetchItems() {
    loading.value = true;
    try {
      items.value = await api.get("/api/examples");
    } finally {
      loading.value = false;
    }
  }

  async function createItem(name: string) {
    const item = await api.post<{ id: number; name: string }>("/api/examples", { name });
    items.value.push(item);
  }

  async function deleteItem(id: number) {
    await api.delete(`/api/examples/${id}`);
    items.value = items.value.filter((i) => i.id !== id);
  }

  return { items, loading, count, fetchItems, createItem, deleteItem };
});
