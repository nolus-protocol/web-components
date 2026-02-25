<template>
  <div class="flex flex-col gap-y-6">
    <div v-if="showAttributes">
      <div
        v-if="showAttributes"
        class="flex items-center justify-between gap-2"
        :class="headerClasses"
      >
        <div class="flex items-center gap-2 flex-1 md:flex-none">
          <Input
            v-if="searchable"
            id="dropdown-search"
            class="w-full md:w-96"
            type="search"
            v-bind="inputSearch"
            @onSearchClear="emit('onSearchClear')"
            @input="(e) => emit('onInput', e)"
          />
          <span
            v-if="size"
            class="hidden md:block text-14 font-normal"
            >{{ size }}</span
          >
        </div>
        <TableSettings
          v-if="toggle || hideValues"
          :toggle="toggle"
          :hideValues="hideValues"
          @togle-value="(data) => emit('togle-value', data)"
          @hide-value="(data) => emit('hide-value', data)"
        />
      </div>
    </div>
    <div class="w-full">
      <div :class="tableWrapperClasses">
        <slot></slot>
        <div class="scroll-bar overflow-auto">
          <div :class="['flex flex-col', tableClasses]">
            <div
              v-if="columns && columns.length > 0"
              :class="['flex border-b-[1px] border-border-color py-3', columnsClasses]"
            >
              <div
                v-for="(column, i) in columns"
                :key="column.label"
                :class="[
                  'flex flex-1 items-center justify-end gap-0.5 text-14 font-normal text-typography-default',
                  column.class,
                  { '!justify-start': column.variant === 'left' },
                  { '!justify-center': column.variant === 'center' },
                  i === 0 && scrollable
                    ? 'sticky left-0 z-20 mr-[12px] bg-neutral-bg-2 after:absolute after:right-0 after:top-[-0.75rem] after:h-[calc(0.75rem+0.75rem+100%)] after:w-px after:bg-border-color md:after:bg-transparent'
                    : ''
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
        </div>
        <div
          v-if="$slots.footer"
          :class="[footerClasses]"
        >
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Input, SvgIcon, Tooltip } from "@/components";
import { type TableProps } from "./types";
import TableSettings from "./TableSettings.vue";
import { computed } from "vue";

const props = withDefaults(defineProps<TableProps>(), {
  scrollable: true
});
const emit = defineEmits<{
  (e: "onInput", value: Event): void;
  (e: "onSearchClear"): void;
  (e: "hide-value", value: boolean): void;
  (e: "togle-value", value: boolean): void;
}>();

const showAttributes = computed(() => {
  return props.searchable || props.size || props.toggle || props.hideValues;
});
</script>

<style lang="scss" scoped></style>
