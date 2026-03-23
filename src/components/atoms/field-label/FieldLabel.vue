<template>
  <label
    v-if="label"
    :for="forId"
    class="w-max cursor-pointer text-sm font-normal text-typography-default"
  >{{ label }}</label>
</template>

<script lang="ts" setup>
defineProps<{
  label?: string;
  forId: string;
}>();
</script>
