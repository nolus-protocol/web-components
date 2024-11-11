<template>
  <component
    :is="icon"
    v-bind="svgAttributes"
  />
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent } from "vue";
import { type SvgProps } from "./types";

const props = withDefaults(defineProps<SvgProps>(), {
  size: "m"
});

const icon = computed(() => {
  return defineAsyncComponent(() => import(`../../../assets/icons/${props.name}.svg`));
});

const svgAttributes = computed(() => {
  switch (props.size) {
    case "xs":
      return { width: "16", height: "16", viewBox: "0 0 16 16" };
    case "s":
      return { width: "18", height: "18", viewBox: "0 0 18 18" };
    case "l":
      return { width: "24", height: "24", viewBox: "0 0 24 24" };
    case "xl":
      return { width: "32", height: "32", viewBox: "0 0 32 32" };
    case "2xl":
      return { width: "40", height: "40", viewBox: "0 0 40 40" };
    default:
      return { width: "20", height: "20", viewBox: "0 0 20 20" };
  }
});
</script>

<style lang="" scoped></style>
