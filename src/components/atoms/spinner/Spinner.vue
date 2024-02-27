<template>
  <svg :class="classes" class="animate-spin" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
  </svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

export interface SpinnerProps {
  width?: string;
  height?: string;
  color?: string;
}

const props = withDefaults(defineProps<SpinnerProps>(), {
  color: 'black',
  width: '24px',
  height: '24px',
});

const classes = computed(() => ({
  'animate-spin': true,
  [`bg-${props.color}`]: props.color,
  [`w-[${props.width}]`]: props.width,
  [`h-[${props.height}]`]: props.height,
}));
const style = computed(() => ({}));
</script>

<style lang="" scoped>

</style>
