<template>
  <div
    :class="{ 'pointer-events-none': disabled }"
    class="flex items-center gap-2 text-16 font-normal text-typography-default"
    @click="handleClick"
  >
    <input
      :id="id"
      ref="radioInput"
      :class="[inputClass]"
      :name="name"
      class="nls-focus h-4 w-4 cursor-pointer appearance-none rounded-full border-[1px] border-border-dominant bg-secondary-default checked:border-4 checked:border-primary-default checked:bg-secondary-default hover:bg-secondary-hover checked:hover:border-primary-hover"
      type="radio"
    />
    <label
      :class="[labelClass]"
      :for="id"
      class="cursor-pointer"
      >{{ label }}</label
    >
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

export interface CheckboxProps {
  id: string;
  label: string;
  name: string;
  labelClass?: string;
  inputClass?: string;
  disabled?: boolean;
}

withDefaults(defineProps<CheckboxProps>(), {
  label: "Connect Wallet"
});

const radioInput = ref<HTMLElement | null>(null);

const handleClick = () => {
  if (radioInput.value) {
    radioInput.value.click();
  }
};
</script>

<style lang="scss" scoped></style>
