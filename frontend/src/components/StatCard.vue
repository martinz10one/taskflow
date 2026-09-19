<template>
  <div class="stat-card" :style="colorBg ? { borderColor: colorBg } : {}">
    <span class="stat-card__value" :style="colorBg ? { color: colorBg } : {}">{{ valor }}</span>
    <span class="stat-card__label">{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({
  valor:    { type: [Number, String], required: true },
  label:    { type: String, required: true },
  colorBg:  { type: String, default: '' },
});
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.stat-card {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  border-top-width: 3px;

  &__value {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1;
  }

  &__label {
    font-size: 0.85rem;
    color: $color-text-muted;
    font-weight: 500;
  }
}
</style>
