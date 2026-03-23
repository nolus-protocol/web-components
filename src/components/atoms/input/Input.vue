<template>
  <div
    :id="`input-wrapper-${id}`"
    class="field-wrapper"
  >
    <FieldLabel :label="label" :for-id="`input-${id}`" />
    <div
      v-if="type === InputType.search"
      class="relative"
    >
      <input
        v-model="inputValue"
        :id="`input-${id}`"
        :class="[
          'w-full peer',
          'px-9.5 pr-7',
          classes,
          inputClass
        ]"
        :disabled="disabled"
        :placeholder="placeholder"
        :type="type"
        @input="(e) => $emit('input', e)"
      />
      <SearchIcon
        id="search-close"
        :class="[
          {
            'left-1': size === Size.small,
            'left-2': size === Size.medium
          }
        ]"
        class="absolute top-[50%] translate-y-[-50%] text-icon-default pointer-events-none peer-focus:fill-icon-link transition duration-150 ease-out"
      />
      <span
        v-if="inputValue"
        class="
          absolute right-2 top-[50%] flex h-4.5 w-4.5 p-0.75 translate-y-[-50%] cursor-pointer items-center justify-center rounded-full bg-icon-default
          hover:bg-icon-secondary
          transition duration-150 ease-out
        "
      >
        <SvgIcon
          name="close"
          class="w-full h-full fill-neutral-bg-2"
          @click="onSearchClear"
        />
      </span>
    </div>
    <input
      v-else
      v-model="inputValue"
      :id="`input-${id}`"
      :class="[classes, inputClass]"
      :disabled="disabled"
      :placeholder="placeholder"
      :type="type"
      @input="(e) => $emit('input', e)"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import FieldLabel from "../field-label/FieldLabel.vue";
import SearchIcon from "@/assets/icons/search.svg";
import { Size } from "@/shared/utils/types";
import type { InputProps } from "./types";
import { InputType } from "./types";
import SvgIcon from "../svg-icon/SvgIcon.vue";

const props = withDefaults(defineProps<InputProps>(), {
  size: Size.medium,
  type: InputType.text
});

// Create a ref for the input element
const inputValue = ref(props.value);

const classes = computed(() => ([
  "flex h-10 gap-2 items-center rounded-md border border-border-dominant bg-neutral-bg-2 text-16 font-normal text-typography-default shadow-small outline-transparent focus-visible:outline focus-visible:outline-border-focus focus-visible:border-border-focus transition duration-150 ease-out",
  
  {

  "px-2 py-1": props.size === Size.small,
  "px-3 py-2": props.size === Size.medium,

  "border-border-success! text-typography-success": props.error,
  "border-border-error! text-typography-error": props.error,

  "": props.type === InputType.password
}]));

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

<style lang="css">
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>
