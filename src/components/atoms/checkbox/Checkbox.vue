<template>
  <label
    :for="id"
    class="text-typography-default relative flex cursor-pointer items-center gap-2 text-16 font-normal"
  >
    <input
      :id="id"
      v-model="model"
      class="sr-only"
      type="checkbox"
    />
    <span
      :class="[
        {
          '!bg-primary-default border-primary-default hover:!bg-primary-hover hover:border-primary-hover': model
        }
      ]"
      class="bg-secondary-default border-border-dominant hover:bg-secondary-hover checked:bg-primary-default checked:hover:bg-primary-hover nls-focus flex h-5 w-5 cursor-pointer appearance-none items-center justify-center rounded-md border-[1px] transition-colors duration-200 ease-in-out"
      ><CheckedIcon
        v-if="model"
        class="transition-all duration-200 ease-in-out"
      />
    </span>
    <span>{{ label }}</span>
  </label>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import CheckedIcon from "@/assets/icons/checked.svg";

export interface CheckboxProps {
  id: string;
  label?: string;
  value?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<CheckboxProps>(), {
  value: false
});

const model = ref(props.value);

watch(model, (newValue) => {
  emit("input", newValue);
});

const emit = defineEmits<{
  (e: "input", value: boolean): void;
}>();
</script>

<style lang="scss" scoped></style>
