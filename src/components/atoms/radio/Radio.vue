<template>
  <label
    :for="id"
    :class="{ 'pointer-events-none': disabled }"
    class="inline-flex items-center gap-2 text-16 font-normal text-typography-default cursor-pointer"
    @click="handleClick"
  >
    <input
      :id="id"
      ref="radioInput"
      :class="[inputClass]"
      :name="name"
      class="
        appearance-none  
        pointer-events-none h-6 w-6 min-w-6 cursor-pointer rounded-full 
        border-[1px] border-border-dominant bg-secondary-default outline-hidden outline-2 outline-offset-2
        checked:border-[6px] checked:border-primary-default checked:bg-secondary-default hover:bg-secondary-hover checked:hover:border-primary-hover
        focus-visible:outline focus-visible:outline-typography-link
        "
      style="transition: border 100ms ease-out"
      type="radio"
      :checked="isChecked"
    />
    {{ label }}
  </label>
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
