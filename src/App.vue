<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/"
                  test="1">Home</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped></style>
