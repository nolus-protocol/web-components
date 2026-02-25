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
@reference "../../../assets/styles/theme.css";

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
