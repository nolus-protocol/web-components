<template>
  <div class="text-typography-default flex items-center gap-2 text-16 font-normal">
    <input
      :id="id"
      :class="[inputClass]"
      :name="name"
      class="border-border-dominant bg-secondary-default hover:bg-secondary-hover checked:border-primary-default checked:hover:border-primary-hover checked:bg-secondary-default nls-focus h-4 w-4 cursor-pointer appearance-none rounded-full border-[1px] checked:border-4"
      type="radio"
    />
    <label
      :class="[labelClass]"
      :for="id"
      class="cursor-pointer"
      >Checked state</label
    >
  </div>
</template>

<script lang="ts" setup>
export interface CheckboxProps {
  id: string;
  label: string;
  name: string;
  labelClass?: string;
  inputClass?: string;
}

withDefaults(defineProps<CheckboxProps>(), {
  label: "Connect Wallet",
  id: "checkbox-1"
});
</script>

<style lang="scss" scoped></style>
