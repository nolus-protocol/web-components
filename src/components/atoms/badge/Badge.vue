<template>
  <div :class="['w-fit rounded bg-neutral-bg-3 text-typography-default', classes]">
    <template v-if="base">
      {{ content }}
    </template>
    <template v-else>
      <SvgIcon
        :class="[
          {
            'fill-icon-success': isPositive,
            'rotate-180 fill-icon-error': isNegative
          }
        ]"
        name="arrow"
        size="xs"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { IBadgeProps } from "@/components/atoms/badge/types";
import { SvgIcon } from "@/components";

const props = withDefaults(defineProps<IBadgeProps>(), {
  base: true
});

const isPositive = computed(() => !isNaN(Number(props.content)) && Number(props.content) > 0);
const isNegative = computed(() => !isNaN(Number(props.content)) && Number(props.content) < 0);
const isZero = computed(() => !isNaN(Number(props.content)) && Number(props.content) === 0);

const classes = computed(() => ({
  "text-typography-default text-[12px] leading-[12px] p-1 ": props.base,
  "!bg-success-muted p-0.5": !props.base && (isPositive.value || isZero.value),
  "!bg-error-muted p-0.5": !props.base && isNegative.value
}));
</script>

<style lang="scss" scoped></style>
