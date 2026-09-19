<template>
  <div class="loading-spinner" role="status" aria-label="Cargando">
    <div class="loading-spinner__ring"></div>
    <span v-if="texto" class="loading-spinner__text">{{ texto }}</span>
  </div>
</template>

<script setup>
defineProps({ texto: { type: String, default: '' } });
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
}

.loading-spinner__ring {
  width: 36px;
  height: 36px;
  border: 3px solid #e2e8f0;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.loading-spinner__text {
  font-size: 0.85rem;
  color: #64748b;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
