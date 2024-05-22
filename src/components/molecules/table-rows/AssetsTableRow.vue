<template>
  <div
    :class="[{ 'earn-row-actions relative': rowButton }]"
    class="flex border-b-[1px] border-border-color py-3"
  >
    <div
      v-for="(item, index) in items"
      :key="index"
      :class="[item.class]"
      class="flex flex-1 items-center gap-0.5 text-18 font-medium uppercase text-neutral-400 [&:not(:first-child)]:justify-end [&:not(:first-child)]:text-16"
    >
      <Button
        v-if="item.button"
        class="text-[14px]"
        icon="icon-transfer"
        icon-position="left"
        severity="secondary"
        size="medium"
        @click="$emit('button-click', { items })"
      />
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
          :class="[{ 'justify-center': !item.subValue }]"
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
        </div>
      </div>
    </div>
    <Button
      v-if="rowButton"
      class="nls-btn-show mt-6 w-full text-[14px] md:mt-0 md:w-auto"
      severity="secondary"
      size="medium"
      v-bind="rowButton"
      @click="$emit('button-click', { items })"
    />
    <slot name="rowFooter"></slot>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { Button } from "@/components";
import { type AssetsTableRowItem, type AssetsTableRowItemProps, CURRENCY_VIEW_TYPES } from "./types";

defineProps<AssetsTableRowItemProps>();

const emit = defineEmits<{
  (e: "button-click", data: { items: AssetsTableRowItem[] }): void;
}>();
</script>

<style lang="scss" scoped></style>
