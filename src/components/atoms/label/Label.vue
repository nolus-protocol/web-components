<template>
  <div
    :class="[`label-${variant}`]"
    class="inline-flex min-h-6 w-fit items-center rounded border px-2 text-xs font-medium leading-[24px]"
  >
    <slot v-if="!value"></slot>
    <span v-else>{{ value }}</span>
    <Tooltip
      v-if="tooltip && tooltip.length > 0"
      position="right"
      :content="tooltip"
    >
      <SvgIcon
        class="ml-1"
        size="s"
        name="info"
        :class="[`label-${variant}`]"
        :defaultColor="false"
      />
    </Tooltip>
  </div>
</template>

<script lang="ts" setup>
import type { LabelProps } from "@/components/atoms/label/types";
import { Tooltip } from "@/components";
import SvgIcon from "../svg-icon/SvgIcon.vue";

const props = defineProps<LabelProps>();
</script>

<style lang="scss" scoped>
.label {
  &-secondary {
    border-color: var(--color-border-default);
    background-color: var(--color-secondary-default);
    color: var(--color-typography-default);
  }
  &-info {
    border-color: var(--color-border-focus);
    background-color: var(--color-info-muted);
    color: var(--color-typography-link);
  }
  &-success {
    border-color: var(--color-border-success);
    background-color: var(--color-success-muted);
    color: var(--color-typography-success);
  }
  &-warning {
    border-color: var(--color-border-warning);
    background-color: var(--color-warning-muted);
    color: var(--color-typography-warning);
  }
  &-error {
    border-color: var(--color-border-error);
    background-color: var(--color-error-muted);
    color: var(--color-typography-error);
  }
}
</style>
