<template>
  <div class="flex items-center gap-2 text-[13px] font-normal text-neutral-typography-200">
    <input
      :id="id"
      :class="[inputClass]"
      class="h-3.5 w-3.5 cursor-pointer appearance-none rounded-[3px] border-[1px] border-border-color bg-neutral-bg-50 checked:appearance-auto hover:border-neutral-typography-50"
      type="checkbox"
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
  labelClass?: string;
  inputClass?: string;
}

const props = defineProps<CheckboxProps>();
</script>

<style lang="scss" scoped></style>
