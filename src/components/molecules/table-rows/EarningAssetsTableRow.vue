<template>
  <div class="flex flex-wrap border-b-[1px] border-border-color py-3">
    <template
      v-for="(item, index) in items"
      :key="index"
    >
      <div
        :class="[item.class, { 'row-actions': item.button }]"
        class="relative flex flex-1 items-center gap-0.5 text-18 font-medium uppercase text-neutral-400 [&:not(:first-child)]:justify-end [&:not(:first-child)]:text-16"
      >
        <Button
          class="nls-btn-show text-[14px]"
          severity="secondary"
          size="medium"
          v-bind="item.button"
          @click="$emit('button-click', { items, index: id })"
        />
        <div
          :class="[{ 'flex gap-4': item.image }]"
          class="info-show"
        >
          <img
            v-if="item.image"
            :alt="item.value"
            :src="item.image"
          />
          <div
            :class="[{ 'items-end': index > 0 }]"
            class="flex flex-col"
          >
            <div class="text-neutral-typography-200">{{ item.value }}</div>
            <div
              v-if="item.subValue"
              class="flex-1 text-12"
            >
              {{ item.subValue }}
            </div>
            <div
              v-if="item.valueInfo"
              class="flex items-center rounded-md bg-neutral-bg-100 p-1 text-[8px] font-medium leading-normal text-neutral-typography-100"
            >
              {{ item.valueInfo }}
            </div>
          </div>
        </div>
      </div>
      <template v-if="item.button">
        <Button
          class="mt-3 w-full text-[14px] md:hidden"
          severity="secondary"
          size="medium"
          v-bind="item.button"
          @click="$emit('button-click', { items, index: id })"
        />
      </template>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { Button } from "@/components";
import type { EarningAssetsTableRowItem, EarningAssetsTableRowItemProps } from "./types";

defineProps<EarningAssetsTableRowItemProps>();

const emit = defineEmits<{
  (e: "button-click", data: { items: EarningAssetsTableRowItem[]; index: any }): void;
}>();
</script>

<style lang="scss" scoped></style>
