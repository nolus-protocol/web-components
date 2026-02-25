<template>
  <div
    :id="`input-wrapper-${id}`"
    class="field-wrapper"
  >
    <label
      v-if="label"
      :for="`input-${id}`"
      class="field-label"
      >{{ label }}</label
    >
    <div
      v-if="type === InputType.search"
      class="relative"
    >
      <SearchIcon
        id="search-close"
        :class="[
          {
            'left-2': size === Size.small,
            'left-3': size === Size.medium
          }
        ]"
        class="absolute top-[50%] translate-y-[-50%] text-icon-default"
      />
      <input
        v-model="inputValue"
        :class="[
          'field-input',
          'w-full',
          '!focus:px-[34px] !focus:pr-[24px] !px-[35px] !pr-[25px]',
          classes,
          inputClass
        ]"
        :disabled="disabled"
        :placeholder="placeholder"
        :type="type"
        @input="(e) => $emit('input', e)"
      />
      <i
        v-if="inputValue"
        class="icon icon-close absolute right-2 top-[50%] flex h-[18px] w-[18px] translate-y-[-50%] cursor-pointer items-center justify-center rounded-full bg-icon-default text-neutral-bg-2"
        @click="onSearchClear"
      />
    </div>
    <input
      v-else
      v-model="inputValue"
      :class="['field-input', classes, inputClass]"
      :disabled="disabled"
      :placeholder="placeholder"
      :type="type"
      @input="(e) => $emit('input', e)"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import SearchIcon from "@/assets/icons/search.svg";
import { Size } from "@/shared/utils/types";
import type { InputProps } from "./types";
import { InputType } from "./types";

const props = withDefaults(defineProps<InputProps>(), {
  size: Size.medium,
  type: InputType.text
});

// Create a ref for the input element
const inputValue = ref(props.value);

const classes = computed(() => ({
  "px-2 py-1 focus:px-[7px] focus:py-[3px]": props.size === Size.small,
  "px-3 py-2 focus:px-[11px] focus:py-[7px]": props.size === Size.medium,

  "!border-border-success": props.valid,
  "!border-danger-100": props.error,

  password: props.type === InputType.password
}));

watch(
  () => props.value,
  () => {
    inputValue.value = props.value;
  }
);

const emit = defineEmits<{
  (e: "input", event: Event): void;
  (e: "onSearchClear", event: Event): void;
}>();

const onSearchClear = (e: Event) => {
  emit("onSearchClear", e);
  inputValue.value = "";
};
</script>

<style lang="scss" scoped>
.field-wrapper {
  .icon-close:before {
    font-size: 10px;
  }
}
.rotate-180 {
  transform: rotateX(180deg);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

#search-close {
  path {
    stroke: white;
    fill: white;
  }
}
</style>
