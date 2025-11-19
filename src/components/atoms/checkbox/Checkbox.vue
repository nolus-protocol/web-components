<template>
  <label
    :for="id"
    class="relative flex cursor-pointer select-none items-center gap-2 text-16 font-normal text-typography-default"
  >
    <input
      :id="id"
      v-model="model"
      class="sr-only"
      type="checkbox"
      :disabled="disabled"
      @input.stop
    />
    <span
      :class="[
        {
          'border-primary-default !bg-primary-default hover:border-primary-hover hover:!bg-primary-hover': model,
          'cursor-not-allowed opacity-60': disabled
        }
      ]"
      class="nls-focus flex h-5 w-5 cursor-pointer appearance-none items-center justify-center rounded-md border-[1px] border-border-dominant bg-secondary-default transition-colors duration-200 ease-in-out checked:bg-primary-default hover:bg-secondary-hover checked:hover:bg-primary-hover"
    >
      <CheckedIcon
        v-if="model"
        class="transition-all duration-200 ease-in-out"
      />
    </span>
    <span>{{ label }}</span>
  </label>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import CheckedIcon from "@/assets/icons/checked.svg";

export interface CheckboxProps {
  id: string;
  label?: string;
  modelValue?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<CheckboxProps>(), {
  modelValue: false,
  disabled: false
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value)
});
</script>
