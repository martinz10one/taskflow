<template>
  <div class="dashboard">
    <h1>Dashboard</h1>

    <LoadingSpinner v-if="cargando" texto="Cargando estadísticas..." />

    <template v-else>
      <div class="dashboard__stats">
        <StatCard :valor="est.total" label="Total" color-bg="#2563eb" />
        <StatCard :valor="est.pendientes" label="Pendientes" color-bg="#64748b" />
        <StatCard :valor="est.enCola" label="En cola" color-bg="#2563eb" />
        <StatCard :valor="est.procesando" label="Procesando" color-bg="#d97706" />
        <StatCard :valor="est.respondidas" label="Respondidas" color-bg="#16a34a" />
        <StatCard :valor="est.errores" label="Errores" color-bg="#dc2626" />
      </div>

      <div class="dashboard__section">
        <div class="dashboard__section-header">
          <h2>Solicitudes recientes</h2>
          <router-link to="/nueva" class="btn btn--primary btn--sm">Nueva solicitud</router-link>
        </div>
        <LoadingSpinner v-if="cargandoRecientes" texto="Cargando..." />
        <EmptyState v-else-if="recientes.length === 0" icono="📭" texto="No hay solicitudes aún." />
        <div v-else class="dashboard__list">
          <RequestCard v-for="s in recientes" :key="s.id" :solicitud="s" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import StatCard from '@/components/StatCard.vue';
import RequestCard from '@/components/RequestCard.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import EmptyState from '@/components/EmptyState.vue';
import { useRequestStore } from '@/store/requestStore';

const store = useRequestStore();
const est = ref({ total: 0, pendientes: 0, enCola: 0, procesando: 0, respondidas: 0, errores: 0 });
const recientes = ref([]);
const cargando = ref(true);
const cargandoRecientes = ref(true);
let intervalo = null;

onMounted(async () => {
  store.initSocket();
  try {
    const [stats, sols] = await Promise.all([
      store.fetchEstadisticas().then(() => store.estadisticas),
      store.fetchSolicitudes().then(() => store.solicitudes),
    ]);
    est.value = stats;
    recientes.value = sols.slice(0, 5);
  } catch (e) {
    console.error(e);
  } finally {
    cargando.value = false;
    cargandoRecientes.value = false;
  }

  intervalo = setInterval(async () => {
    await store.fetchEstadisticas();
    est.value = { ...store.estadisticas };
    await store.fetchSolicitudes();
    recientes.value = store.solicitudes.slice(0, 5);
  }, 5000);
});

onUnmounted(() => { clearInterval(intervalo); });
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.dashboard {
  h1 {
    margin-bottom: $spacing-lg;
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: $spacing-md;
    margin-bottom: $spacing-xl;
  }

  &__section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-md;

    h2 {
      font-size: 1.15rem;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }
}
</style>
