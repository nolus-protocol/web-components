<template>
  <div :class="['w-fit rounded bg-neutral-bg-3 text-typography-default', classes]">
    <template v-if="base">
      {{ content }}
    </template>
    <template v-else>
      <ArrowIcon
        :class="[
          {
            'fill-icon-success': isPositive,
            'rotate-180 fill-icon-error': isNegative
          }
        ]"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { IBadgeProps } from "@/components/atoms/badge/types";
import ArrowIcon from "@/assets/icons/arrow.svg";

const props = withDefaults(defineProps<IBadgeProps>(), {
  base: true
});

const isPositive = computed(() => !isNaN(Number(props.content)) && Number(props.content) > 0);
const isNegative = computed(() => !isNaN(Number(props.content)) && Number(props.content) < 0);
const isZero = computed(() => !isNaN(Number(props.content)) && Number(props.content) === 0);

const classes = computed(() => ({
  "text-typography-default text-[20px] leading-[20px] p-1 ": props.base || isZero.value,
  "!bg-success-muted p-0.5": !props.base && isPositive.value,
  "!bg-error-muted p-0.5": !props.base && isNegative.value
}));
</script>

<style lang="scss" scoped></style>
