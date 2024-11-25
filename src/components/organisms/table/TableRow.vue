<template>
  <div
    :class="[{ 'table-row-actions relative': rowButton }]"
    class="flex flex-wrap py-3"
  >
    <div
      v-for="(item, index) in items"
      :key="index"
      :class="[
        'flex flex-1 items-center justify-end gap-0.5 text-16 font-normal text-typography-default',
        item.class,
        { '!justify-start': item.variant === 'left' },
        { '!justify-center': item.variant === 'center' }
      ]"
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
        :class="[{ 'flex items-center gap-4': item.image }]"
      >
        <img
          v-if="item.image"
          :alt="item.value"
          :class="item.imageClass"
          :src="item.image"
          class="h-8 w-8 object-contain"
        />
        <div
          :class="[{ 'justify-center': !item.subValue }]"
          class="flex flex-col"
        >
          <div
            :class="[
              'flex justify-end text-typography-default',
              { '!justify-start': item.variant === 'left' },
              { '!justify-center': item.variant === 'center' }
            ]"
          >
            <component :is="item.component" />
            <template v-if="item.url">
              <a
                :href="item.url"
                class="flex items-center gap-1 text-typography-link"
                target="_blank"
              >
                {{ item.value }}
              </a>
            </template>
            <template v-else>{{ item.value }}</template>
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
            :class="[
              'flex flex-1 text-12',
              { '!justify-end': item.variant === 'right' },
              { '!justify-center': item.variant === 'center' }
            ]"
          >
            {{ item.subValue }}
          </div>
        </div>
      </div>
    </div>
    <Button
      v-if="rowButton"
      class="row-btn-show mt-6 w-full text-[14px] md:mt-0 md:w-auto"
      severity="secondary"
      size="medium"
      v-bind="rowButton"
      @click="$emit('button-click', { items })"
    />
    <slot name="rowFooter"></slot>
  </div>
</template>

<script lang="ts" setup>
import { Button } from "@/components";
import { CURRENCY_VIEW_TYPES, type TableRowItem, type TableRowItemProps } from "./types";

defineProps<TableRowItemProps>();

const emit = defineEmits<{
  (e: "button-click", data: { items: TableRowItem[] }): void;
}>();

function isComponent(value: any): boolean {
  return value && (typeof value === "object" || typeof value === "function") && value.__isVue;
}
</script>

<style lang="scss" scoped></style>
