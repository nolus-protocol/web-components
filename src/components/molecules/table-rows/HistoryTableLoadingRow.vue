<template>
  <div :class="['flex flex-col gap-1 border-b-[1px] border-border-color py-3 md:flex-row md:gap-0', $attrs.class]">
    <div :class="['flex flex-1 items-center gap-0.5 text-14 font-medium uppercase text-neutral-400', $attrs.class]">
      <a
        class="flex items-center gap-1 text-primary-50"
        target="_blank"
      >
        <slot name="status"></slot>
        {{ props.status }}
      </a>
    </div>
    <div :class="['flex flex-1 items-center gap-0.5 text-12 text-14 font-medium text-neutral-400', $attrs.class]">
      <span :class="['text-neutral-typography-200']">{{ props.action }}</span>
    </div>
    <div
      :class="['flex flex-1 items-center gap-0.5 text-12 font-medium text-neutral-400 md:justify-end', $attrs.class]"
    >
      <span>{{ props.fee }}</span>
    </div>
    <div :class="['flex flex-1 items-end gap-0.5 text-12 font-medium text-neutral-400 md:justify-end', $attrs.class]">
      <Button
        class="text-[14px]"
        severity="secondary"
        size="medium"
        @click="$emit('button-click')"
        :label="props.button"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { HistoryTableRowLoadingItemProps } from "./types";
import { Button } from "@/components";

const props = defineProps<HistoryTableRowLoadingItemProps>();
const emit = defineEmits<{
  (e: "button-click"): void;
}>();
</script>

<style lang="scss" scoped></style>
