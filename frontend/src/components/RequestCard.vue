<template>
  <router-link :to="{ name: 'detalle', params: { id: solicitud.id } }" class="request-card card">
    <div class="request-card__header">
      <span class="request-card__id">#{{ solicitud.id?.slice(-6) }}</span>
      <EstadoBadge :estado="solicitud.estado" />
    </div>
    <h3 class="request-card__title">{{ solicitud.titulo }}</h3>
    <p class="request-card__desc text-muted text-sm">{{ solicitud.descripcion }}</p>
    <div class="request-card__meta text-sm text-muted">
      <span>{{ solicitud.categoria }}</span>
      <span>{{ solicitud.prioridad }}</span>
      <span>{{ formatDate(solicitud.fechaCreacion) }}</span>
    </div>
  </router-link>
</template>

<script setup>
import EstadoBadge from '@/components/EstadoBadge.vue';
import { formatDate } from '@/utils/formatDate';

defineProps({ solicitud: { type: Object, required: true } });
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.request-card {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s, transform 0.15s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
    text-decoration: none;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-sm;
  }

  &__id {
    font-size: 0.78rem;
    color: $color-text-muted;
    font-family: monospace;
  }

  &__title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: $spacing-xs;
  }

  &__desc {
    margin-bottom: $spacing-sm;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__meta {
    display: flex;
    gap: $spacing-md;
  }
}
</style>
