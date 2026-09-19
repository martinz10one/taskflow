<template>
  <div class="filtros-bar">
    <input
      v-model="busquedaLocal"
      class="input filtros-bar__search"
      type="search"
      placeholder="Buscar por título o descripción..."
      @input="aplicar"
    />
    <select v-model="filtroCategoria" class="select filtros-bar__select" @change="aplicar">
      <option value="">Todas las categorías</option>
      <option v-for="c in CATEGORIAS" :key="c" :value="c">{{ c }}</option>
    </select>
    <select v-model="filtroPrioridad" class="select filtros-bar__select" @change="aplicar">
      <option value="">Todas las prioridades</option>
      <option v-for="p in PRIORIDADES" :key="p" :value="p">{{ p }}</option>
    </select>
    <select v-model="filtroEstado" class="select filtros-bar__select" @change="aplicar">
      <option value="">Todos los estados</option>
      <option v-for="e in ESTADOS" :key="e" :value="e">{{ e }}</option>
    </select>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { CATEGORIAS, PRIORIDADES } from '@/utils/estados';

const ESTADOS = ['PENDIENTE', 'EN COLA', 'PROCESANDO', 'RESPONDIDA', 'ERROR'];

const emit = defineEmits(['filtrar']);

const busquedaLocal = ref('');
const filtroCategoria = ref('');
const filtroPrioridad = ref('');
const filtroEstado = ref('');

function aplicar() {
  const filtros = {};
  if (busquedaLocal.value) filtros.busqueda = busquedaLocal.value;
  if (filtroCategoria.value) filtros.categoria = filtroCategoria.value;
  if (filtroPrioridad.value) filtros.prioridad = filtroPrioridad.value;
  if (filtroEstado.value) filtros.estado = filtroEstado.value;
  emit('filtrar', filtros);
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.filtros-bar {
  display: flex;
  gap: $spacing-sm;
  flex-wrap: wrap;
  margin-bottom: $spacing-lg;

  &__search {
    flex: 1;
    min-width: 200px;
  }

  &__select {
    min-width: 160px;
  }
}

@media (max-width: $bp-tablet) {
  .filtros-bar {
    flex-direction: column;

    &__select {
      min-width: unset;
    }
  }
}
</style>
