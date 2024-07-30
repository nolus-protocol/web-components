<template>
  <button
    :class="['font-semibold', classes, props.class]"
    :disabled="disabled"
    :style="style"
    type="button"
    @click="onClick"
  >
    <span
      v-if="icon && iconPosition === 'left'"
      :class="[icon]"
      class="icon"
    />
    {{ label }}
    <span
      v-if="icon && iconPosition === 'right'"
      :class="[icon]"
      class="icon"
    />
    <span
      v-if="icon && !iconPosition"
      :class="[icon]"
      class="icon"
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
  "button button-primary": props.severity === Type.primary,
  "button button-secondary": props.severity === Type.secondary,

  "px-3 py-1 rounded-full text-12": props.size === Size.small,
  "px-4 py-2 rounded-full text-14": props.size === Size.medium,
  "px-6 py-2 rounded-full text-14": props.size === Size.large,

  "button-primary-loading": props.severity === Type.primary && props.loading,
  "button-secondary-loading": props.severity === Type.secondary && props.loading
}));

const style = computed(() => ({}));

const onClick = () => {
  emit("click");
};
</script>
