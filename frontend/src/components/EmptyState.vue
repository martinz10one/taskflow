<template>
  <div class="empty-state">
    <span class="empty-state__icon">{{ icono }}</span>
    <p class="empty-state__text">{{ texto }}</p>
  </div>
</template>

<script setup>
defineProps({
  icono: { type: String, default: '📭' },
  texto: { type: String, default: 'No hay elementos para mostrar.' },
});
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.empty-state {
  text-align: center;
  padding: $spacing-xl $spacing-lg;
  color: $color-text-muted;

  &__icon {
    font-size: 2.5rem;
    display: block;
    margin-bottom: $spacing-sm;
  }

  &__text {
    font-size: 0.95rem;
  }
}
</style>
