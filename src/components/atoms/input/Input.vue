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
    <input
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
import { debounce } from "@/shared/helpers";

export interface InputProps {
  id: string;
  label?: string;
  type: "text" | "password" | "email";
  value?: string | number;
  error?: boolean;
  disabled?: boolean;
  onChange?: (event: Event) => void;
}

const props = defineProps<InputProps>();

const classes = computed(() => ({
  "!border-danger-100": props.error,
  password: props.type === "password"
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
