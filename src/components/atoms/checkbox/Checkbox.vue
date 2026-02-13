<template>
  <label
    :for="id"
    class="
      group
      relative inline-flex select-none items-center gap-2 
      text-16 font-normal text-typography-default
    "
    :class="disabled ? 'text-typography-disabled cursor-not-allowed' : 'cursor-pointer'"
  >
    <input
      :id="id"
      v-model="model"
      class="peer sr-only"
      type="checkbox"
      :disabled="disabled"
      @input.stop
    />
    <span
      :class="{'opacity-60': disabled}"
      class="flex h-6 w-6 min-w-6 cursor-pointer appearance-none items-center justify-center rounded-md border-[1px] border-border-dominant bg-secondary-default transition-colors duration-200 ease-out
      peer-checked:border-primary-default peer-checked:bg-primary-default
      group-hover:bg-secondary-hover
      peer-focus-visible:outline peer-focus-visible:outline-typography-link
      outline-2 outline-offset-2
      "
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
export interface CheckboxProps {
  id: string;
  label?: string;
  disabled?: boolean;
}

withDefaults(defineProps<CheckboxProps>(), {
  disabled: false
});

const model = defineModel<boolean>({ default: false });
</script>
