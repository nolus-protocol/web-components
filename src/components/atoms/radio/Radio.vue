<template>
  <template
    :class="{ 'pointer-events-none': disabled }"
    class="flex items-center gap-2 text-16 font-normal text-typography-default"
    @click="handleClick"
  >
    <input
      :id="id"
      ref="radioInput"
      :class="[inputClass]"
      :name="name"
      class="nls-focus pointer-events-none h-4 w-4 cursor-pointer appearance-none rounded-full border-[1px] border-border-dominant bg-secondary-default checked:border-4 checked:border-primary-default checked:bg-secondary-default hover:bg-secondary-hover checked:hover:border-primary-hover"
      type="radio"
      :checked="isChecked"
    />
    <label
      :class="[labelClass]"
      :for="id"
      class="pointer-events-none cursor-pointer"
      >{{ label }}</label
    >
  </template>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

export interface CheckboxProps {
  id: string;
  label: string;
  name: string;
  labelClass?: string;
  inputClass?: string;
  disabled?: boolean;
  checked?: boolean;
}

const emit = defineEmits(["click"]);
const props = withDefaults(defineProps<CheckboxProps>(), {
  checked: false
});
const isChecked = ref(props.checked);

const radioInput = ref<HTMLInputElement | null>(null);

const handleClick = () => {
  if (radioInput.value) {
    radioInput.value.checked = true;
  }
  emit("click");
};

watch(
  () => props.checked,
  () => {
    isChecked.value = props.checked;
  }
);
</script>

<style lang="scss" scoped></style>
