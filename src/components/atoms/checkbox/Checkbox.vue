<template>
  <label
    :for="id"
    class="
      relative inline-flex cursor-pointer select-none items-center gap-2 
      text-16 font-normal text-typography-default
      active:scale-[98%]
    "
    :class="{'text-typography-disabled': disabled}"
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
      class="nls-focus flex h-5 w-5 min-w-5 p-0.5 cursor-pointer appearance-none items-center justify-center rounded-md border-[1px] border-border-dominant bg-secondary-default transition-colors duration-200 ease-out checked:bg-primary-default hover:bg-secondary-hover checked:hover:bg-primary-hover"
    >
      <svg xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 13 11"
        width="12" height="12" 
      >
        <path 
          d="M1 7L5 10L12 0.25" 
          fill="none" 
          class="
            stroke-2 stroke-typography-static-light
            all duration-200 ease-out
          " 
          style="
            stroke-linecap: round; 
            stroke-linejoin: round; 
            stroke-dasharray: 16 18;
          " 
          :style="{strokeDashoffset: !model ? 16 : 0}"
        />
      </svg>
    </span>
    <span>{{ label }}</span>
  </label>
</template>

<script lang="ts" setup>
import CheckedIcon from "@/assets/icons/checked.svg";

export interface CheckboxProps {
  id: string;
  label?: string;
  modelValue?: boolean;
  disabled?: boolean;
}

withDefaults(defineProps<CheckboxProps>(), {
  disabled: false
});

const model = defineModel<boolean>({ default: false });
</script>
