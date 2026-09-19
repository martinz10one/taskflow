<template>
  <div class="service-card" :class="`service-card--${estado}`">
    <span class="service-card__dot"></span>
    <span class="service-card__name">{{ nombre }}</span>
    <span class="service-card__status">{{ estado }}</span>
  </div>
</template>

<script setup>
defineProps({
  nombre: { type: String, required: true },
  estado: { type: String, required: true },
});
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.service-card {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  padding: $spacing-md;

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: $color-pendiente;
  }

  &__name {
    font-weight: 500;
    text-transform: capitalize;
  }

  &__status {
    margin-left: auto;
    font-size: 0.8rem;
    color: $color-text-muted;
  }

  &--disponible &__dot { background: $color-respondida; }
  &--no-disponible &__dot { background: $color-error; }
}
</style>
