<template>
  <section class="auth card">
    <div class="auth__brand">TF</div>
    <h1>{{ registro ? 'Crea tu cuenta' : 'Inicia sesión' }}</h1>
    <p class="text-muted">{{ registro ? 'Registra y administra tus propias solicitudes.' : 'Accede a tus solicitudes de TaskFlow.' }}</p>
    <form @submit.prevent="enviar">
      <label for="email">Correo electrónico</label>
      <input id="email" v-model.trim="email" type="email" autocomplete="email" required maxlength="254" />
      <label for="password">Contraseña</label>
      <input id="password" v-model="password" :autocomplete="registro ? 'new-password' : 'current-password'" type="password" required minlength="12" maxlength="128" />
      <p v-if="error" class="alert alert--error">{{ error }}</p>
      <button class="btn btn--primary" type="submit" :disabled="cargando">
        {{ cargando ? 'Un momento…' : registro ? 'Crear cuenta' : 'Entrar' }}
      </button>
    </form>
    <button class="auth__toggle" type="button" @click="cambiarModo">
      {{ registro ? '¿Ya tienes cuenta? Inicia sesión' : '¿Primera vez? Crea una cuenta' }}
    </button>
    <small>La contraseña requiere al menos 12 caracteres.</small>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/plugins/axios';
import socket from '@/plugins/socket';

const router = useRouter();
const registro = ref(false);
const email = ref('');
const password = ref('');
const error = ref('');
const cargando = ref(false);

function cambiarModo() {
  registro.value = !registro.value;
  error.value = '';
}

async function enviar() {
  cargando.value = true;
  error.value = '';
  try {
    const ruta = registro.value ? '/auth/registro' : '/auth/login';
    const { data } = await api.post(ruta, { email: email.value, password: password.value });
    localStorage.setItem('taskflow-token', data.token);
    socket.auth = { token: data.token };
    socket.connect();
    await router.replace({ name: 'dashboard' });
  } catch (e) {
    error.value = e.message;
  } finally {
    cargando.value = false;
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
.auth { max-width: 430px; margin: 8vh auto; padding: $spacing-xl; }
.auth__brand { display: grid; place-items: center; width: 42px; height: 42px; margin-bottom: $spacing-md; border-radius: $radius-sm; background: $color-primary; color: #fff; font-weight: 700; }
h1 { margin-bottom: $spacing-xs; }
form { display: grid; gap: $spacing-sm; margin-top: $spacing-lg; }
input { width: 100%; padding: $spacing-sm; border: 1px solid $color-border; border-radius: $radius-sm; }
button { cursor: pointer; }
.auth__toggle { margin-top: $spacing-md; padding: 0; border: 0; background: none; color: $color-primary; }
small { display: block; margin-top: $spacing-md; color: $color-text-muted; }
</style>
