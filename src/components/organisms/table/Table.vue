<template>
  <div
    class="flex w-full flex-col gap-6 border-[1px] border-neutral-100 bg-neutral-bg-50 p-6 shadow-field-normal lg:rounded-xl dark:border-border-color"
  >
    <div
      v-if="title || $slots.header"
      :class="[{ 'justify-between': $slots.header && title, 'justify-end': $slots.header && !title }]"
      class="flex text-16 font-medium leading-none text-neutral-typography-200"
    >
      {{ title }}

      <div v-if="$slots.header">
        <slot name="header"></slot>
      </div>
    </div>
    <div class="flex flex-col [&>*:last-child]:border-none">
      <div :class="['flex border-b-[1px] border-border-color pb-2.5', columnsClasses]">
        <div
          v-for="(column, index) in columns"
          :key="column.label"
          :class="[
            'flex flex-1 items-center gap-0.5 text-12 font-medium uppercase text-neutral-400',
            { 'md:justify-end': index >= columns.length - 2 },
            column.class
          ]"
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
