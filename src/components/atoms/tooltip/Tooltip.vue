<template>
  <div
    ref="target"
    class="relative flex w-fit flex-col items-center text-typography-default"
    @mouseleave="mouseleave"
    @mouseenter="mouseenter"
  >
    <slot></slot>
  </div>
  <Teleport to="body">
    <div
      ref="tooltip"
      :class="[
        'z-[9999] max-w-[200px] rounded bg-neutral-bg-inverted-2 px-2 py-1 text-xs text-typography-inverted',
        { [`tooltip-cursor tooltip-cursor-${position}`]: position },
        $attrs.class
      ]"
      :style="tooltipStyle"
    >
      <div v-html="content" />
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import type { TooltipProps } from "./types";
import { ref, watch } from "vue";

let timeout: NodeJS.Timeout;

const props = withDefaults(defineProps<TooltipProps>(), {
  position: "top"
});

const tooltip = ref(null as HTMLDivElement | null);
const target = ref(null as HTMLDivElement | null);
const tooltipStyle = ref({});

const mouseenter = (event: Event) => {
  if (timeout) {
    clearTimeout(timeout);
  }

  const element = tooltip.value as HTMLDivElement;

  calculateTooltipPosition();

  element.style.visibility = "visible";
  element.style.opacity = "1";
};

const mouseleave = (event: Event) => {
  const element = tooltip.value as HTMLDivElement;
  if (element) {
    element.style.opacity = "0";
    timeout = setTimeout(() => {
      element.style.visibility = "hidden";
    }, 200);
  }
};

const setPositionValue = (value: string) => {
  return value === "auto" ? "auto" : `${value}px`;
};

const calculateTooltipPosition = () => {
  if (!target.value || !tooltip.value) return;

  const rect = target.value.getBoundingClientRect();
  const tooltipRect = tooltip.value.getBoundingClientRect();
  const viewportWidth = window.innerWidth;

  let top: any, left: any, right: any;

  switch (props.position) {
    case "top":
      top = rect.top - tooltipRect.height - 10; // 10 is the offset
      left = rect.left + rect.width / 2 - tooltipRect.width / 2;
      right = "auto";

      if (tooltipRect.width + rect.x > viewportWidth) {
        left = "auto";
        right = viewportWidth - rect.right;
      }

      break;
    case "bottom":
      top = rect.bottom + 10; // 10 is the offset
      left = rect.left + rect.width / 2 - tooltipRect.width / 2;
      right = "auto";

      if (tooltipRect.width + rect.x > viewportWidth) {
        left = "auto";
        right = viewportWidth - rect.right;
      }
      break;
    case "left":
      top = rect.top + rect.height / 2 - tooltipRect.height / 2;
      left = rect.left - tooltipRect.width - 10; // 10 is the offset
      break;
    case "right":
      top = rect.top + rect.height / 2 - tooltipRect.height / 2;
      left = rect.right + 10; // 10 is the offset
      break;
  }

  tooltipStyle.value = {
    top: setPositionValue(top),
    left: setPositionValue(left),
    right: setPositionValue(right),
    position: "fixed"
  };
};

watch(() => [target.value, props.position], calculateTooltipPosition);
</script>

<style lang="scss" scoped>
.tooltip-cursor {
  @apply invisible opacity-0;

  //&:before {
  //  content: "";
  //  @apply absolute h-2 w-2 rotate-45 bg-neutral-bg-inverted-2;
  //}
  //
  //&-top {
  //  &:before {
  //    @apply bottom-0 left-[50%] translate-x-[-50%] translate-y-[50%];
  //  }
  //}
  //
  //&-bottom {
  //  &:before {
  //    @apply left-[50%] top-0 translate-x-[-50%] translate-y-[-50%];
  //  }
  //}
  //
  //&-left {
  //  &:before {
  //    @apply right-0 top-[50%] translate-x-[50%] translate-y-[-50%];
  //  }
  //}
  //
  //&-right {
  //  &:before {
  //    @apply left-0 top-[50%] translate-x-[-50%] translate-y-[-50%];
  //  }
  //}
}

.pointer {
  @apply fixed -bottom-1 left-0 right-0 h-3 w-3 rotate-45 bg-neutral-bg-inverted-2;
}
</style>
