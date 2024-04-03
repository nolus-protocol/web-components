<template>
  <div class="flex flex-col gap-1 border-b-[1px] border-border-color py-2.5 md:flex-row md:gap-0">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="flex flex-1 items-center gap-0.5 text-12 font-medium uppercase text-neutral-400 md:[&:not(:first-child)]:justify-end"
    >
      <div :class="[{ 'font-semibold': item.bold }]">
        <a
          v-if="item.url"
          :href="item.url"
          class="text-primary-50 hover:underline"
          target="_blank"
        >
          {{ item.value }}
        </a>
        <span
          v-else
          :class="[{ 'text-neutral-typography-200': item.bold }]"
          >{{ item.value }}</span
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import type { HistoryTableRowItemProps } from "./types";

defineProps<HistoryTableRowItemProps>();
</script>

<style lang="scss" scoped></style>
