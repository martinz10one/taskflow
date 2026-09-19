<template>
  <div class="monitor">
    <h1>Monitor del sistema</h1>

    <LoadingSpinner v-if="cargando" texto="Cargando monitor..." />

    <template v-else>
      <div class="monitor__services">
        <h2>Servicios</h2>
        <div class="monitor__grid">
          <ServiceCard
            v-for="(val, key) in datos.servicios"
            :key="key"
            :nombre="key"
            :estado="val"
          />
        </div>
      </div>

      <div class="monitor__counts">
        <h2>Cola y procesamiento</h2>
        <div class="monitor__grid">
          <StatCard :valor="datos.solicitudes.enCola" label="En cola" color-bg="#2563eb" />
          <StatCard :valor="datos.solicitudes.procesando" label="Procesando" color-bg="#d97706" />
          <StatCard :valor="datos.solicitudes.respondidas" label="Respondidas" color-bg="#16a34a" />
          <StatCard :valor="datos.solicitudes.errores" label="Errores" color-bg="#dc2626" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import StatCard from '@/components/StatCard.vue';
import ServiceCard from '@/components/ServiceCard.vue';
import { useRequestStore } from '@/store/requestStore';

const store = useRequestStore();
const datos = ref({ servicios: {}, solicitudes: { enCola: 0, procesando: 0, respondidas: 0, errores: 0 } });
const cargando = ref(true);
let intervalo = null;

onMounted(async () => {
  try {
    await store.fetchMonitor();
    datos.value = { ...store.monitor };
  } catch (e) {
    console.error(e);
  } finally {
    cargando.value = false;
  }

  intervalo = setInterval(async () => {
    await store.fetchMonitor();
    datos.value = { ...store.monitor };
  }, 5000);
});

onUnmounted(() => { clearInterval(intervalo); });
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.monitor {
  h1 {
    margin-bottom: $spacing-lg;
  }

  h2 {
    font-size: 1rem;
    margin-bottom: $spacing-md;
  }

  &__services {
    margin-bottom: $spacing-xl;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: $spacing-md;
  }
}
</style>
