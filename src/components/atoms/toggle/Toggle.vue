<template>
  <label
    :class="[
      {
        'pointer-events-none': disabled,
        'flex items-center gap-2': label
      }
    ]"
    :for="id"
    class="relative inline-block cursor-pointer"
  >
    <input
      :id="id"
      v-model="model"
      :disabled="disabled"
      :name="id"
      class="sr-only"
      type="checkbox"
    />
    <span
      :class="[
        {
          'border-primary-default bg-primary-default hover:border-primary-hover hover:bg-primary-hover': model
        }
      ]"
      class="block h-6 w-10 rounded-full border-[1px] border-border-dominant px-[3px] py-1 transition-all duration-200 ease-in-out"
    >
      <span
        :class="[
          {
            'translate-x-[79%] bg-static-light': model
          }
        ]"
        class="absolute top-[50%] h-[18px] w-[18px] translate-y-[-50%] rounded-full bg-border-dominant transition-all duration-200 ease-in-out"
      ></span>
    </span>
    <span
      v-if="label"
      class="text-16 text-typography-default"
      >{{ label }}</span
    >
  </label>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import type { ToggleProps } from "./types";

const props = withDefaults(defineProps<ToggleProps>(), {
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

<style lang="scss" scoped>
input:focus-visible + span {
  @apply focus-visible:outline focus-visible:outline-offset-1 focus-visible:outline-primary-hover active:outline-none;
}
</style>
