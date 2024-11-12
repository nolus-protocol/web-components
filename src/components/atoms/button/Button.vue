<template>
  <button
    :class="['font-semibold', 'button', classes, `button-${severity}`, props.class]"
    :disabled="disabled"
    :style="style"
    type="button"
    @click="onClick"
  >
    <SvgIcon
      v-if="icon && iconPosition === 'left'"
      :name="icon"
      :size="iconSize"
    />
    {{ label }}
    <SvgIcon
      v-if="icon && iconPosition === 'right'"
      :name="icon"
      :size="iconSize"
    />

    <SvgIcon
      v-if="icon && !iconPosition"
      :name="icon"
      :size="iconSize"
      class="flex"
    />
    <!--    <span-->
    <!--      v-if="icon && !iconPosition"-->
    <!--      :class="[icon]"-->
    <!--      class="icon flex"-->
    <!--    />-->
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

const emit = defineEmits<{
  (e: "click"): void;
}>();

const classes = computed(() => ({
  "px-3 py-1 rounded-full text-12": props.size === Size.small,
  "px-4 py-2 rounded-full text-14": props.size === Size.medium,
  "px-6 py-2 rounded-full text-14": props.size === Size.large,

  "button-loading": props.loading
}));

const iconSize = computed(() => {
  if (props.size === Size.small) return "xs";
  if (props.size === Size.medium) return "s";
  if (props.size === Size.large) return "m";

  return "m";
});

const style = computed(() => ({}));

const onClick = () => {
  emit("click");
};
</script>
