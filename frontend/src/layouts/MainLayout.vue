<template>
  <div class="layout">
    <header class="header">
      <div class="header__brand">
        <router-link to="/" class="header__logo">TF</router-link>
        <span class="header__title">TaskFlow</span>
      </div>
      <nav class="nav" :class="{ 'nav--open': menuAbierto }">
        <router-link to="/" class="nav__link" @click="menuAbierto = false">Dashboard</router-link>
        <router-link to="/nueva" class="nav__link" @click="menuAbierto = false">Nueva solicitud</router-link>
        <router-link to="/solicitudes" class="nav__link" @click="menuAbierto = false">Listado</router-link>
        <router-link to="/monitor" class="nav__link" @click="menuAbierto = false">Monitor</router-link>
      </nav>
      <button class="header__menu-btn" @click="menuAbierto = !menuAbierto">
        <span></span><span></span><span></span>
      </button>
    </header>
    <main class="main">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const menuAbierto = ref(false);
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md $spacing-lg;
  background: $color-surface;
  border-bottom: 1px solid $color-border;
  position: sticky;
  top: 0;
  z-index: 100;

  &__brand {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  &__logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: $color-primary;
    color: #fff;
    font-weight: 700;
    font-size: 0.85rem;
    border-radius: $radius-sm;
    text-decoration: none;
  }

  &__title {
    font-weight: 600;
    font-size: 1.1rem;
  }

  &__menu-btn {
    display: none;
    flex-direction: column;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;

    span {
      display: block;
      width: 22px;
      height: 2px;
      background: $color-text;
      border-radius: 2px;
      transition: transform 0.2s;
    }
  }
}

.nav {
  display: flex;
  gap: $spacing-sm;

  &__link {
    padding: $spacing-xs $spacing-md;
    border-radius: $radius-md;
    font-size: 0.9rem;
    font-weight: 500;
    color: $color-text-muted;
    transition: background 0.2s, color 0.2s;
    text-decoration: none;

    &:hover {
      background: $color-bg;
      color: $color-text;
      text-decoration: none;
    }

    &.router-link-exact-active {
      background: rgba($color-primary, 0.1);
      color: $color-primary;
    }
  }
}

.main {
  flex: 1;
  padding: $spacing-xl;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

@media (max-width: $bp-tablet) {
  .header__menu-btn {
    display: flex;
  }

  .nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: $color-surface;
    border-bottom: 1px solid $color-border;
    flex-direction: column;
    padding: $spacing-sm;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

    &--open {
      display: flex;
    }
  }

  .main {
    padding: $spacing-md;
  }
}
</style>
