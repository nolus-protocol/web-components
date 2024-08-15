<template>
  <button
    :class="['font-semibold', 'button', classes, props.class]"
    :disabled="disabled"
    :style="style"
    type="button"
    @click="onClick"
  >
    <span
      v-if="icon && iconPosition === 'left'"
      :class="[icon]"
      class="icon flex"
    />
    {{ label }}
    <span
      v-if="icon && iconPosition === 'right'"
      :class="[icon]"
      class="icon flex"
    />
    <span
      v-if="icon && !iconPosition"
      :class="[icon]"
      class="icon flex"
    />
    <span
      v-if="loading"
      class="absolute mx-auto my-0"
    >
      <Spinner :severity="severity" />
    </span>
  </button>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import Spinner from "../spinner/Spinner.vue";
import { Size, Type } from "@/shared/utils/types";
import type { ButtonProps } from "@/components/atoms/button/types";

const props = defineProps<ButtonProps>();

const emit = defineEmits<{
  (e: "click"): void;
}>();

const classes = computed(() => ({
  "button-primary": props.severity === Type.primary,
  "button-secondary": props.severity === Type.secondary,
  "button-tertiary": props.severity === Type.tertiary,
  "button-danger": props.severity === Type.danger,

  "px-3 py-1 rounded-full text-12": props.size === Size.small,
  "px-4 py-2 rounded-full text-14": props.size === Size.medium,
  "px-6 py-2 rounded-full text-14": props.size === Size.large,

  "button-loading": props.loading
}));

const style = computed(() => ({}));

const onClick = () => {
  emit("click");
};
</script>
