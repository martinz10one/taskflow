<template>
  <span class="badge" :style="{ background: estilo.bg, color: estilo.color }">
    {{ estilo.label }}
  </span>
</template>

<script setup>
import { computed } from 'vue';
import { getEstadoStyle } from '@/utils/estados';

const props = defineProps({ estado: { type: String, required: true } });
const estilo = computed(() => getEstadoStyle(props.estado));
</script>

<style scoped>
.badge {
  display: inline-block;
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  white-space: nowrap;
}
</style>
