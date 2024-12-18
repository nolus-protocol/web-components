<template>
  <div
    :class="[`label-${variant}`]"
    class="inline-flex min-h-6 w-fit items-center rounded border-[1px] px-2 py-1 text-[13px] font-medium"
  >
    <slot v-if="!value"></slot>
    <span v-else>{{ value }}</span>
  </div>
</template>

<script lang="ts" setup>
import type { LabelProps } from "@/components/atoms/label/types";

const props = defineProps<LabelProps>();
</script>

<style lang="scss" scoped>
.label {
  &-secondary {
    @apply border-border-default bg-secondary-default text-typography-default;
  }
  &-info {
    @apply border-border-focus bg-info-muted text-typography-link;
  }
  &-success {
    @apply border-border-success bg-success-muted text-typography-success;
  }
  &-warning {
    @apply border-border-warning bg-warning-muted text-typography-warning;
  }
  &-error {
    @apply border-border-error bg-error-muted text-typography-error;
  }
}
</style>
