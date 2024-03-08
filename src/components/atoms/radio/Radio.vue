<template>
  <div class="flex items-center gap-2 font-normal text-[13px] text-neutral-typography-200">
    <input :id="id" :class="[inputClass]" :name="[name]" class="w-4 h-4 border-[1px] appearance-none border-border-color hover:border-neutral-typography-50 rounded-full cursor-pointer bg-neutral-bg-50 checked:border-4 checked:border-primary-50 checked:hover:border-primary-50 dark:checked:bg-neutral-bg-50" type="radio" />
    <label :class="[labelClass]" :for="id" class="cursor-pointer">Checked state</label>
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

const props = withDefaults(defineProps<CheckboxProps>(), {
  label: 'Connect Wallet',
  id: 'checkbox-1'
});


</script>

<style lang="scss" scoped>
input[type="checkbox"] {
  //appearance: none;
  //-webkit-appearance: none;
  //-moz-appearance: none;
}
</style>
