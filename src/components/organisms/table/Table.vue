<template>
  <div class="flex w-full flex-col gap-6 rounded-xl border-[1px] border-border-color bg-neutral-bg-50 p-6">
    <div
      v-if="title || $slots.header"
      :class="[{ 'justify-between': $slots.header && title, 'justify-end': $slots.header && !title }]"
      class="flex text-neutral-typography-200"
    >
      {{ title }}

      <div v-if="$slots.header">
        <slot name="header"></slot>
      </div>
    </div>
    <div class="flex flex-col">
      <div :class="['flex border-b-[1px] border-border-color pb-2.5', columnsClasses]">
        <div
          v-for="column in columns"
          :key="column.label"
          :class="[column.class]"
          class="flex flex-1 items-center gap-0.5 text-12 font-medium uppercase text-neutral-400 [&:not(:first-child)]:justify-end"
        >
          {{ column.label }}
          <Tooltip
            v-if="column.tooltip && column.tooltip.length > 0"
            :content="column.tooltip"
            class="text-[23px]"
          />
        </div>
      </div>
      <slot name="body"></slot>
    </div>
    <div
      v-if="$slots.footer"
      :class="[footerClasses]"
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Tooltip } from "@/components";

const props = defineProps<{
  title?: string;
  columns: {
    label: string;
    class?: string;
    tooltip?: string;
  }[];
  columnsClasses?: string;
  footerClasses?: string;
}>();
</script>
