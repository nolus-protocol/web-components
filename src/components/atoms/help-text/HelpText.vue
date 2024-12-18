<template>
  <div class="flex items-center gap-1">
    <ErrorTriangle
      v-if="variant === Variant.error"
      class="fill-icon-error"
    />
    <i
      v-if="variant === Variant.success"
      class="icon icon-success flex h-[20px] w-[20px] items-center justify-center rounded-full bg-icon-success text-[16px] leading-none text-success-muted"
    ></i>
    <div
      :class="[classes]"
      class="text-14 font-normal text-typography-error"
    >
      <slot
        v-if="$slots.content"
        name="content"
      ></slot>
      <template v-else>{{ content }}</template>
    </div>
    <span
      v-if="variant === Variant.info"
      class="flex h-5 w-5 items-center justify-center rounded-full bg-icon-link text-12 text-typography-inverted"
      >?</span
    >
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Variant } from "@/shared/utils/types";
import type { IHelpTextProps } from "./types";

import ErrorTriangle from "@/assets/icons/error-triangle.svg";

const props = withDefaults(defineProps<IHelpTextProps>(), {
  variant: Variant.info
});

const classes = computed(() => ({
  "text-typography-error": props.variant === Variant.error,
  "text-typography-success": props.variant === Variant.success,
  "text-typography-link": props.variant === Variant.info
}));
</script>

<style lang="scss" scoped></style>
