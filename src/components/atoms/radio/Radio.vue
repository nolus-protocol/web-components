<template>
  <div class="flex items-center gap-2 text-[13px] font-normal text-neutral-typography-200">
    <input
      :id="id"
      :class="[inputClass]"
      :name="name"
      class="h-4 w-4 cursor-pointer appearance-none rounded-full border-[1px] border-border-color bg-neutral-bg-50 checked:border-4 checked:border-primary-50 hover:border-neutral-typography-50 checked:hover:border-primary-50 dark:checked:bg-neutral-bg-50"
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
