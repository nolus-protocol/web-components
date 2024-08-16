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
        :class="[
          {
            'left-2': size === Size.small,
            'left-3': size === Size.medium
          }
        ]"
        class="absolute top-[50%] translate-y-[-50%]"
      />
      <input
        :id="`input-${id}`"
        :class="[
          'field-input',
          'w-full',
          classes,
          {
            'px-2 pl-[32px]': props.size === Size.small,
            'px-3 pl-[32px]': props.size === Size.medium
          }
        ]"
        :disabled="disabled"
        :type="type"
        :value="value"
        @input="updateInputValue"
      />
      <i
        v-if="value"
        class="icon icon-close"
        @click="clearInput"
      />
    </div>
    <input
      v-else
      :id="`input-${id}`"
      :class="['field-input', classes]"
      :disabled="disabled"
      :type="type"
      :value="value"
      @input="updateInputValue"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import SearchIcon from "@/assets/icons/search.svg";
import { debounce } from "@/shared/helpers";
import { Size } from "@/shared/utils/types";
import type { InputProps } from "./types";
import { InputType } from "./types";

const props = withDefaults(defineProps<InputProps>(), {
  size: Size.medium
});

const classes = computed(() => ({
  "px-2 py-1": props.size === Size.small,
  "px-3 py-2": props.size === Size.medium,

  "!border-border-success": props.valid,
  "!border-danger-100": props.error,

  password: props.type === InputType.password
}));

const emit = defineEmits<{
  (e: "input", value: string | number): void;
}>();

const updateInputValue = debounce((event: Event) => {
  const inputValue = (event.target as HTMLInputElement).value;

  emit("input", inputValue);

  if (props.onChange) {
    props.onChange(event);
  }
}, 300);

// Add a method to clear the input value
const clearInput = () => {
  emit("input", "");
};
</script>

<style lang="scss" scoped>
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
</style>
