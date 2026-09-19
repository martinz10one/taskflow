<template>
  <form class="request-form" @submit.prevent="enviar">
    <div v-if="errores.length" class="alert alert--error">
      <ul>
        <li v-for="(e, i) in errores" :key="i">{{ e }}</li>
      </ul>
    </div>

    <div class="form-group">
      <label class="label">Título *</label>
      <input v-model="form.titulo" class="input" type="text" maxlength="200" required />
    </div>

    <div class="form-group">
      <label class="label">Descripción *</label>
      <textarea v-model="form.descripcion" class="input" rows="4" maxlength="2000" required></textarea>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="label">Categoría *</label>
        <select v-model="form.categoria" class="select" required>
          <option value="" disabled>Seleccionar...</option>
          <option v-for="c in CATEGORIAS" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div class="form-group">
        <label class="label">Prioridad</label>
        <select v-model="form.prioridad" class="select">
          <option v-for="p in PRIORIDADES" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>
    </div>

    <button type="submit" class="btn btn--primary" :disabled="enviando">
      {{ enviando ? 'Enviando...' : 'Registrar solicitud' }}
    </button>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { CATEGORIAS, PRIORIDADES } from '@/utils/estados';
import { validateRequest } from '@/utils/validateRequest';
import { crearSolicitud } from '@/services/requestService';

const emit = defineEmits(['creada']);

const form = reactive({
  titulo: '',
  descripcion: '',
  categoria: '',
  prioridad: 'Media',
});

const errores = ref([]);
const enviando = ref(false);

async function enviar() {
  errores.value = validateRequest(form);
  if (errores.value.length) return;

  enviando.value = true;
  try {
    const creada = await crearSolicitud({ ...form });
    emit('creada', creada);
  } catch (e) {
    errores.value = [e.message];
  } finally {
    enviando.value = false;
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-md;

  @media (max-width: $bp-tablet) {
    grid-template-columns: 1fr;
  }
}
</style>
