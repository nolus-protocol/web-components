<template>
  <div :class="['flex flex-col gap-1 border-b-[1px] border-border-color py-3 md:flex-row md:gap-0', classes]">
    <div
      v-for="(item, index) in items"
      :key="index"
      :class="[
        'flex flex-1 items-center gap-0.5 text-12 font-medium text-neutral-400',
        item.class,
        { 'md:justify-end': index >= items.length - 2 },
        { 'font-semibold': item.bold }
      ]"
    >
      <template v-if="item.url">
        <a
          :href="item.url"
          class="flex items-center gap-1 text-primary-50"
          target="_blank"
        >
          {{ item.value }}
        </a>
      </template>
      <template v-else>
        <span :class="[{ 'text-neutral-typography-200': item.bold }]">{{ item.value }}</span>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { HistoryTableRowItemProps } from "./types";

defineProps<HistoryTableRowItemProps>();
</script>

<style lang="scss" scoped></style>
