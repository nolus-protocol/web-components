<template>
  <div
    :class="[{ 'table-row-actions relative': rowButton }]"
    class="flex flex-wrap border-b-[1px] border-border-color py-3"
  >
    <div
      v-for="(item, index) in items"
      :key="index"
      :class="[item.class]"
      class="relative flex flex-1 items-center gap-0.5 text-18 font-medium text-neutral-400 [&:not(:first-child)]:justify-end [&:not(:first-child)]:text-16"
    >
      <div
        v-if="!item.button"
        :class="[{ 'flex gap-4': item.image }]"
      >
        <img
          v-if="item.image"
          :alt="item.value"
          :class="item.imageClass"
          :src="item.image"
        />
        <div
          :class="[{ 'items-end': index > 0, 'justify-center': !item.subValue }]"
          class="flex flex-col"
        >
          <div
            :class="[{ 'text-right': index > 0 }]"
            class="text-neutral-typography-200"
          >
            {{ item.value }}
            <slot
              v-if="item.type === CURRENCY_VIEW_TYPES.TOKEN"
              name="token"
            />
            <slot
              v-if="item.type === CURRENCY_VIEW_TYPES.CURRENCY"
              name="currency"
            />
            <slot
              v-if="item.type === CURRENCY_VIEW_TYPES.COMPLEX"
              name="complex"
            />
          </div>
          <div
            v-if="item.subValue"
            :class="[{ 'text-right': index > 0 }]"
            class="flex-1 text-12"
          >
            {{ item.subValue }}
          </div>
          <div
            v-if="item.valueInfo"
            class="flex w-fit items-center rounded-md bg-neutral-bg-100 p-1 text-[8px] font-medium leading-normal text-neutral-typography-100"
          >
            {{ item.valueInfo }}
          </div>
        </div>
      </div>
      <Button
        v-if="item.button"
        class="text-[14px]"
        severity="secondary"
        size="medium"
        v-bind="item.button"
        @click="$emit('button-click', { items })"
      />
    </div>
    <Button
      v-if="rowButton"
      class="row-btn-show mt-6 w-full text-[14px] md:mt-0 md:w-auto"
      severity="secondary"
      size="medium"
      v-bind="rowButton"
      @click="$emit('button-click', { items })"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { Button } from "@/components";
import { CURRENCY_VIEW_TYPES, type EarningAssetsTableRowItem, type EarningAssetsTableRowItemProps } from "./types";

defineProps<EarningAssetsTableRowItemProps>();

const emit = defineEmits<{
  (e: "button-click", data: { items: EarningAssetsTableRowItem[] }): void;
}>();
</script>

<style lang="scss" scoped></style>
