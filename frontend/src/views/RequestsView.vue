<template>
  <div class="requests">
    <h1>Listado de solicitudes</h1>

    <FiltrosBar @filtrar="onFiltrar" />

    <LoadingSpinner v-if="cargando" texto="Cargando solicitudes..." />

    <EmptyState v-else-if="solicitudes.length === 0" icono="📭" texto="No se encontraron solicitudes con los filtros seleccionados." />

    <div v-else class="requests__list">
      <RequestCard v-for="s in solicitudes" :key="s.id" :solicitud="s" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import FiltrosBar from '@/components/FiltrosBar.vue';
import RequestCard from '@/components/RequestCard.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import EmptyState from '@/components/EmptyState.vue';
import { useRequestStore } from '@/store/requestStore';

const store = useRequestStore();
const solicitudes = ref([]);
const cargando = ref(true);
const filtrosActuales = ref({});
let intervalo = null;

async function cargar(filtros = {}) {
  cargando.value = true;
  filtrosActuales.value = filtros;
  await store.fetchSolicitudes(filtros);
  solicitudes.value = store.solicitudes;
  cargando.value = false;
}

function onFiltrar(filtros) {
  cargar(filtros);
}

onMounted(async () => {
  await cargar();
  intervalo = setInterval(async () => {
    await store.fetchSolicitudes(filtrosActuales.value);
    solicitudes.value = store.solicitudes;
  }, 5000);
});

onUnmounted(() => { clearInterval(intervalo); });
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.requests {
  h1 {
    margin-bottom: $spacing-lg;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }
}
</style>
