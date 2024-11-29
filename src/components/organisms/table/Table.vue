<template>
  <div class="flex flex-col gap-y-6">
    <div v-if="showAttributes || filterable">
      <div
        v-if="showAttributes"
        class="flex items-center gap-2"
      >
        <Input
          v-if="searchable"
          id="dropdown-search"
          class="flex-1"
          type="search"
          v-bind="inputSearch"
        />
        <span
          v-if="size"
          class="text-14 font-normal"
          >{{ size }}</span
        >
        <Toggle
          v-if="toggle"
          v-bind="toggle"
        />
      </div>
      <div v-if="filterable">TODO add filter here</div>
    </div>
    <slot></slot>
    <div :class="['flex flex-col', tableClasses]">
      <div
        v-if="columns && columns.length > 0"
        :class="['flex border-b-[1px] border-border-color py-3', columnsClasses]"
      >
        <div
          v-for="column in columns"
          :key="column.label"
          :class="[
            'flex flex-1 items-center justify-end gap-0.5 text-14 font-normal text-typography-default',
            column.class,
            { '!justify-start': column.variant === 'left' },
            { '!justify-center': column.variant === 'center' }
          ]"
        >
          {{ column.label }}
          <Tooltip
            v-if="column.tooltip"
            v-bind="column.tooltip"
          >
            <SvgIcon name="help" />
          </Tooltip>
          <SvgIcon
            v-if="column.sortable"
            class="cursor-pointer"
            name="arrow"
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
import { Input, SvgIcon, Toggle, Tooltip } from "@/components";
import { type TableProps } from "./types";
import { computed } from "vue";

const props = withDefaults(defineProps<TableProps>(), {});

const showAttributes = computed(() => {
  return props.searchable || props.size || props.toggle;
});
</script>

<style lang="scss" scoped></style>
