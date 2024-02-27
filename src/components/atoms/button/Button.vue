<template>
  <button :class="classes" :style="style" class="" type="button" @click="onClick">
    <template v-if="loading">
      <span class="spinner" />
    </template>
    <template v-else>
      <span v-if="icon && iconPosition === 'left'" :class="[icon]" class="icon" />
      {{label}}
      <span v-if="icon && iconPosition === 'right'" :class="[icon]" class="icon" />
    </template>
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

enum Size {
  small = 'small',
  medium = 'medium',
  large = 'large',
}

enum Type {
  primary = 'primary',
  secondary = 'secondary'
}

export type ButtonSize = keyof typeof Size;
export type ButtonType = keyof typeof Type;

export interface ButtonProps {
  label?: string;
  size?: ButtonSize;
  severity?: ButtonType;
  outlined?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  label: 'Button',
  size: Size.large,
  severity: Type.primary,
});

const emit = defineEmits<{
  (e: 'click', id: number): void;
}>();

const classes = computed(() => ({
  'bg-primary-50 text-white hover:bg-primary-100 active:bg-primary-200': props.severity === Type.primary,

  'px-3 py-1 rounded text-12': props.size === Size.small,
  'px-3 py-2 rounded-md text-14': props.size === Size.medium,
  'px-6 py-3 rounded-lg text-14': props.size === Size.large,

  'bg-white border-[1px] border-neutral-200 !text-neutral-typography-200 hover:!bg-neutral-50 hover:!border-neutral-400': props.outlined,
  '': props.loading,
}));

const style = computed(() => ({
}));

const onClick = () => {
  emit("click", 1)
};

</script>
