<template>
  <div class="detail">
    <LoadingSpinner v-if="cargando" texto="Cargando solicitud..." />

    <template v-else-if="error">
      <div class="alert alert--error">{{ error }}</div>
    </template>

    <template v-else-if="solicitud">
      <div class="detail__header">
        <div>
          <span class="detail__id text-muted text-sm">#{{ solicitud.id?.slice(-8) }}</span>
          <h1>{{ solicitud.titulo }}</h1>
        </div>
        <EstadoBadge :estado="solicitud.estado" />
      </div>

      <div class="detail__grid">
        <div class="card detail__info">
          <p><strong>Descripción:</strong></p>
          <p>{{ solicitud.descripcion }}</p>

          <div class="detail__meta">
            <span><strong>Categoría:</strong> {{ solicitud.categoria }}</span>
            <span><strong>Prioridad:</strong> {{ solicitud.prioridad }}</span>
          </div>

          <div class="detail__dates">
            <span>Creada: {{ formatDate(solicitud.fechaCreacion) }}</span>
            <span v-if="solicitud.fechaProcesamiento">
              Procesada: {{ formatDate(solicitud.fechaProcesamiento) }}
            </span>
            <span v-if="solicitud.fechaRespuesta">
              Respondida: {{ formatDate(solicitud.fechaRespuesta) }}
            </span>
          </div>
        </div>

        <div class="card detail__response">
          <h2>Respuesta</h2>
          <p v-if="solicitud.respuesta">{{ solicitud.respuesta }}</p>
          <p v-else-if="solicitud.error" class="detail__error">{{ solicitud.error }}</p>
          <p v-else class="text-muted">Esperando respuesta del sistema...</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import EstadoBadge from '@/components/EstadoBadge.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { obtenerSolicitud } from '@/services/requestService';
import { formatDate } from '@/utils/formatDate';
import socket from '@/plugins/socket';

const route = useRoute();
const solicitud = ref(null);
const cargando = ref(true);
const error = ref(null);

function onProcesando({ id }) {
  if (solicitud.value?.id === id) {
    solicitud.value.estado = 'PROCESANDO';
  }
}

function onRespondida({ id, respuesta }) {
  if (solicitud.value?.id === id) {
    solicitud.value.estado = 'RESPONDIDA';
    solicitud.value.respuesta = respuesta;
    solicitud.value.fechaRespuesta = new Date().toISOString();
  }
}

function onError({ id, error: err }) {
  if (solicitud.value?.id === id) {
    solicitud.value.estado = 'ERROR';
    solicitud.value.error = err;
  }
}

onMounted(async () => {
  try {
    solicitud.value = await obtenerSolicitud(route.params.id);
  } catch (e) {
    error.value = e.message;
  } finally {
    cargando.value = false;
  }

  socket.on('solicitud-procesando', onProcesando);
  socket.on('solicitud-respondida', onRespondida);
  socket.on('solicitud-error', onError);
});

onUnmounted(() => {
  socket.off('solicitud-procesando', onProcesando);
  socket.off('solicitud-respondida', onRespondida);
  socket.off('solicitud-error', onError);
});
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.detail {
  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
  }

  &__id {
    font-family: monospace;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-lg;
  }

  &__meta {
    display: flex;
    gap: $spacing-lg;
    margin-top: $spacing-md;
    font-size: 0.9rem;
  }

  &__dates {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    margin-top: $spacing-md;
    font-size: 0.85rem;
    color: $color-text-muted;
  }

  &__response h2 {
    margin-bottom: $spacing-md;
    font-size: 1rem;
  }

  &__error {
    color: $color-error;
    font-weight: 500;
  }
}

@media (max-width: $bp-tablet) {
  .detail__grid {
    grid-template-columns: 1fr;
  }
}
</style>
