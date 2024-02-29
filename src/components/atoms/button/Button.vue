<template>
  <button :class="classes" :disabled="disabled" :style="style"
          type="button" @click="onClick">
    <span v-if="icon && iconPosition === 'left'" :class="[icon]" class="icon" />
    {{ label }}
    <span v-if="icon && iconPosition === 'right'" :class="[icon]" class="icon" />
    <span v-if="loading" class="absolute mx-auto my-0">
        <Spinner :severity="severity" />
      </span>
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import Spinner from '../spinner/Spinner.vue'
import { Size, Type } from '@/utils/types'

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
  disabled?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  label: 'Button',
  size: Size.large,
  severity: Type.primary
})

const emit = defineEmits<{
  (e: 'click', id: number): void;
}>()

const classes = computed(() => ({
  'button button-primary': props.severity === Type.primary,
  'button button-secondary': props.severity === Type.secondary,

  'px-3 py-1 rounded text-12': props.size === Size.small,
  'px-3 py-2 rounded-md text-14': props.size === Size.medium,
  'px-6 py-3 rounded-lg text-14': props.size === Size.large,

  'button-primary-loading': props.severity === Type.primary && props.loading,
  'button-secondary-loading': props.severity === Type.secondary && props.loading
}))

const style = computed(() => ({}))

const onClick = () => {
  emit('click', 1)
}

</script>
