<template>
  <div class="flex items-center gap-2 font-normal text-[13px] text-neutral-typography-200">
    <input :id="id" :class="[inputClass]" class="w-3.5 h-3.5 border-[1px] appearance-none border-border-color hover:border-neutral-typography-50 rounded-[3px] cursor-pointer	bg-neutral-bg-50 checked:appearance-auto" type="checkbox" />
    <label :class="[labelClass]" :for="id" class="cursor-pointer">Checked state</label>
  </div>
</template>

<script lang="ts" setup>

export interface CheckboxProps {
  id: string;
  label: string;
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
