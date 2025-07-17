<template>
  <button
    :class="['font-semibold', 'button', classes, `button-${severity}`, props.class]"
    :disabled="disabled"
    :style="style"
    type="button"
  >
    <template v-if="!$slots.default">
      <SvgIcon
        v-if="icon && iconPosition === 'left'"
        :default-color="false"
        :name="icon"
        :size="iconSize"
      />
      {{ label }}
      <SvgIcon
        v-if="icon && iconPosition === 'right'"
        :default-color="false"
        :name="icon"
        :size="iconSize"
      />

      <SvgIcon
        v-if="icon && !iconPosition"
        :default-color="false"
        :name="icon"
        :size="iconSize"
        class="flex"
      />
    </template>
    <template v-else><slot></slot></template>
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
import SvgIcon from "../svg-icon/SvgIcon.vue";
import { Size } from "@/shared/utils/types";
import type { ButtonProps } from "@/components/atoms/button/types";

const props = defineProps<ButtonProps>();

const classes = computed(() => ({
  "px-3 py-1 rounded-full text-12 min-h-8": props.size === Size.small,
  "px-4 py-2 rounded-full text-14 min-h-10": props.size === Size.medium,
  "px-6 py-2 rounded-full text-14 min-h-11": props.size === Size.large,
  "p-2 rounded-full text-12 h-12 w-12": props.size === Size.icon,
  "button-loading": props.loading
}));

const iconSize = computed(() => {
  if (props.size === Size.icon) return "s";
  if (props.size === Size.small) return "s";
  if (props.size === Size.medium) return "m";
  if (props.size === Size.large) return "l";

  return "m";
});

const style = computed(() => ({}));
</script>
