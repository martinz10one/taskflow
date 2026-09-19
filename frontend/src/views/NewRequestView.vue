<template>
  <div class="new-request">
    <h1>Nueva solicitud</h1>
    <div class="card">
      <RequestForm @creada="onCreada" />
    </div>
    <div v-if="exito" class="alert alert--success">
      Solicitud registrada correctamente.
      <router-link :to="{ name: 'detalle', params: { id: exito.id } }">Ver detalle</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import RequestForm from '@/components/RequestForm.vue';

const exito = ref(null);

function onCreada(solicitud) {
  exito.value = solicitud;
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.new-request {
  h1 {
    margin-bottom: $spacing-lg;
  }

  .card {
    max-width: 700px;
  }

  .alert {
    margin-top: $spacing-md;
    max-width: 700px;
  }
}
</style>
