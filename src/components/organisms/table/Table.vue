<template>
  <Widget>
    <div
      v-if="title || $slots.header"
      :class="[{ 'items-center justify-between': $slots.header && title, 'justify-end': $slots.header && !title }]"
      class="flex text-16 font-medium leading-none text-typography-default"
    >
      {{ title }}

      <div v-if="$slots.header">
        <slot name="header"></slot>
      </div>
    </div>
    <div class="flex flex-col [&>*:last-child]:border-none">
      <div :class="['flex border-b-[1px] border-border-default py-3', columnsClasses]">
        <div
          v-for="(column, index) in columns"
          :key="column.label"
          :class="[
            'flex flex-1 items-center gap-0.5 text-14 font-normal text-typography-default',
            { 'justify-end': index > 0 },
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
  </Widget>
</template>

<script lang="ts" setup>
import { Tooltip, Widget } from "@/components";

const props = defineProps<{
  title?: string;
  columns?: {
    label: string;
    class?: string;
    tooltip?: string;
  }[];
  columnsClasses?: string;
  footerClasses?: string;
}>();
</script>
