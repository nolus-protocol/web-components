<template>
  <div class="flex flex-col gap-y-6">
    <div v-if="showAttributes || filterable">
      <div
        v-if="showAttributes"
        class="flex items-center gap-2"
        :class="headerClasses"
      >
        <Input
          v-if="searchable"
          id="dropdown-search"
          class="flex-1"
          type="search"
          v-bind="inputSearch"
          @onSearchClear="emit('onSearchClear')"
          @input="(e) => emit('onInput', e)"
        />
        <span
          v-if="size"
          class="text-14 font-normal"
          >{{ size }}</span
        >
        <Toggle
          v-if="toggle"
          v-bind="toggle"
          v-model="toggle.value"
          @input="onChangeToggle"
        />
        <button
          v-if="hideValues"
          class="flex gap-2"
          @click="onClick"
        >
          <SvgIcon
            v-if="props.hideValues!.value"
            name="eye-slash"
          />
          <template v-else>
            <SvgIcon name="eye-open" />
          </template>
          <span class="text-14 font-medium">{{ hideValues.text }}</span>
        </button>
      </div>
      <div v-if="filterable">TODO add filter here</div>
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
import { Input, SvgIcon, Toggle, Tooltip } from "@/components";
import { type TableProps } from "./types";
import { computed } from "vue";

function onClick() {
  props.hideValues!.value = !props.hideValues!.value;
  emit("hideValue", props.hideValues!.value);
}

function onChangeToggle(data: boolean) {
  emit("togleValue", data);
}

const props = withDefaults(defineProps<TableProps>(), {
  scrollable: true
});
const emit = defineEmits<{
  (e: "onInput", value: Event): void;
  (e: "hideValue", value: boolean): void;
  (e: "togleValue", value: boolean): void;
  (e: "onSearchClear"): void;
}>();

const showAttributes = computed(() => {
  return props.searchable || props.size || props.toggle || props.hideValues;
});
</script>

<style lang="scss" scoped></style>
