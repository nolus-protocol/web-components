<template>
  <div
    ref="target"
    class="relative flex w-fit flex-col items-center text-typography-default"
    @mouseleave="mouseleave"
    @mouseover="mouseover"
  >
    <slot></slot>
  </div>
  <Teleport to="body">
    <div
      ref="tooltip"
      :class="[{ [`tooltip-cursor tooltip-cursor-${position}`]: position }]"
      :style="tooltipStyle"
      class="rounded bg-neutral-bg-inverted-2 px-2 py-1 text-16 text-typography-inverted"
    >
      {{ content }}
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import type { Tooltip } from "./types";
import { ref, watch } from "vue";

let timeout: NodeJS.Timeout;

const props = defineProps<Tooltip>();

const tooltip = ref(null as HTMLDivElement | null);
const target = ref(null as HTMLDivElement | null);
const tooltipStyle = ref({});

const mouseover = () => {
  if (timeout) {
    clearTimeout(timeout);
  }

  const element = tooltip.value as HTMLDivElement;

  calculateTooltipPosition();

  element.style.visibility = "visible";
  element.style.opacity = "1";
};

const mouseleave = () => {
  const element = tooltip.value as HTMLDivElement;
  if (element) {
    element.style.opacity = "0";
    timeout = setTimeout(() => {
      element.style.visibility = "hidden";
    }, 200);
  }
};

const calculateTooltipPosition = () => {
  if (!target.value || !tooltip.value) return;

  const rect = target.value.getBoundingClientRect();
  const tooltipWidth = tooltip.value.offsetWidth;
  const tooltipHeight = tooltip.value.offsetHeight;

  let top, left;

  switch (props.position) {
    case "top":
      top = rect.top - tooltipHeight - 10; // 10 is the offset
      left = rect.left + rect.width / 2 - tooltipWidth / 2;
      break;
    case "bottom":
      top = rect.bottom + 10; // 10 is the offset
      left = rect.left + rect.width / 2 - tooltipWidth / 2;
      break;
    case "left":
      top = rect.top + rect.height / 2 - tooltipHeight / 2;
      left = rect.left - tooltipWidth - 10; // 10 is the offset
      break;
    case "right":
      top = rect.top + rect.height / 2 - tooltipHeight / 2;
      left = rect.right + 10; // 10 is the offset
      break;
  }

  tooltipStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
    position: "fixed"
  };
};

watch(() => [target.value, props.position], calculateTooltipPosition);
</script>

<style lang="scss" scoped>
.tooltip-cursor {
  @apply invisible opacity-0;

  &:before {
    content: "";
    @apply absolute h-2 w-2 rotate-45 bg-neutral-bg-inverted-2;
  }

  &-top {
    &:before {
      @apply bottom-0 left-[50%] translate-x-[-50%] translate-y-[50%];
    }
  }
  &-bottom {
    &:before {
      @apply left-[50%] top-0 translate-x-[-50%] translate-y-[-50%];
    }
  }
  &-left {
    &:before {
      @apply right-0 top-[50%] translate-x-[50%] translate-y-[-50%];
    }
  }
  &-right {
    &:before {
      @apply left-0 top-[50%] translate-x-[-50%] translate-y-[-50%];
    }
  }
}
</style>
