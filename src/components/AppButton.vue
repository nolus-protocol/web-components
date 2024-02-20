<template>
  <button type="button">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps({
    outlined: Boolean
})
</script>
