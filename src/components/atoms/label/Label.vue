<template>
  <div
    :class="[`label-${variant}`, props.class]"
    class="inline-flex min-h-6 items-center rounded border-[1px] px-2 py-1 text-[13px] font-medium"
  >
    <span
      v-if="icon && iconPosition === 'left'"
      :class="[icon]"
      class="icon flex"
    />
    {{ label }}
    <span
      v-if="icon && iconPosition === 'right'"
      :class="[icon]"
      class="icon flex"
    />
    <span
      v-if="icon && !iconPosition"
      :class="[icon]"
      class="icon flex"
    />
  </div>
</template>

<script lang="ts" setup>
import type { LabelProps } from "@/components/atoms/label/types";

const props = defineProps<LabelProps>();
</script>

<style lang="scss" scoped>
.label {
  &-secondary {
    @apply text-typography-default bg-secondary-default border-border-default;
  }
  &-info {
    @apply text-typography-link bg-info-muted border-border-focus;
  }
  &-success {
    @apply text-typography-success bg-success-muted border-border-success;
  }
  &-warning {
    @apply text-typography-warning bg-warning-muted border-border-warning;
  }
  &-error {
    @apply text-typography-error bg-error-muted border-border-error;
  }
}
</style>
