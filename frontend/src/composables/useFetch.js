import { ref } from 'vue';

export function useFetch(fn) {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);

  async function execute(...args) {
    loading.value = true;
    error.value = null;
    try {
      data.value = await fn(...args);
    } catch (e) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  }

  return { data, loading, error, execute };
}
