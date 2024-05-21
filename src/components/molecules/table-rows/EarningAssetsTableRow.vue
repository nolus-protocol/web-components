<template>
  <div
    :class="[{ 'earn-row-actions relative': rowButton }]"
    class="flex flex-wrap border-b-[1px] border-border-color py-3"
  >
    <template
      v-for="(item, index) in items"
      :key="index"
    >
      <div
        :class="[item.class]"
        class="relative flex flex-1 items-center gap-0.5 text-18 font-medium text-neutral-400 [&:not(:first-child)]:justify-end [&:not(:first-child)]:text-16"
      >
        <template v-if="!item.buttonOnly">
          <div :class="[{ 'flex gap-4': item.image }]">
            <img
              v-if="item.image"
              :alt="item.value"
              :class="item.imageClass"
              :src="item.image"
            />
            <div
              :class="[{ 'items-end': index > 0 }]"
              class="flex flex-col"
            >
              <div class="text-neutral-typography-200">
                {{ item.value }}
                <slot
                  v-if="item.type === CURRENCY_VIEW_TYPES.TOKEN"
                  name="token"
                />
                <slot
                  v-if="item.type === CURRENCY_VIEW_TYPES.CURRENCY"
                  name="currency"
                />
              </div>
              <div
                v-if="item.subValue"
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
        </template>
        <template v-if="item.buttonOnly">
          <Button
            class="nls-btn-show !flex text-[14px]"
            severity="secondary"
            size="medium"
            v-bind="item.button"
            @click="$emit('button-click', { items, index: id })"
          />
        </template>
      </div>
    </template>
    <Button
      v-if="rowButton"
      class="nls-btn-show mt-6 w-full text-[14px] md:mt-0 md:w-auto"
      severity="secondary"
      size="medium"
      v-bind="rowButton"
      @click="$emit('button-click', { items, index: id })"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { Button } from "@/components";
import { CURRENCY_VIEW_TYPES, type EarningAssetsTableRowItem, type EarningAssetsTableRowItemProps } from "./types";

defineProps<EarningAssetsTableRowItemProps>();

const emit = defineEmits<{
  (e: "button-click", data: { items: EarningAssetsTableRowItem[]; index: any }): void;
}>();
</script>

<style lang="scss" scoped></style>
