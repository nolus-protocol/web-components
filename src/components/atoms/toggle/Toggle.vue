<template>
  <label
    :class="[
      {
        'pointer-events-none': disabled
      }
    ]"
    :for="id"
    class="relative inline-block h-6 w-10 cursor-pointer"
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
          'bg-primary-default border-primary-default hover:bg-primary-hover hover:border-primary-hover': model
        }
      ]"
      class="border-border-dominant block h-full w-full rounded-full border-[1px] px-[3px] py-1 transition-all duration-200 ease-in-out"
    >
      <span
        :class="[
          {
            'bg-static-light translate-x-[79%]': model
          }
        ]"
        class="bg-border-dominant absolute top-[50%] h-[18px] w-[18px] translate-y-[-50%] rounded-full transition-transform duration-200 ease-in-out"
      ></span>
    </span>
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
  @apply focus-visible:outline-primary-hover focus-visible:outline focus-visible:outline-offset-1 active:outline-none;
}
</style>
