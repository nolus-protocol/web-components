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
    <AnimatePresence>
    <motion.div
      v-if="isVisible"
      ref="tooltip"
      :class="[
        'relative z-9999 max-w-50 rounded bg-neutral-bg-inverted-2 px-2 py-1 text-xs text-typography-inverted',
        { [`tooltip-cursor tooltip-cursor-${position}`]: position },
        $attrs.class
      ]"
      :initial="{ opacity: 0, transform: 'translateY(4px) scale(0.95)' }"
      :animate="{ opacity: 1, transform: 'translateY(0) scale(1)' }"
      :exit="{ opacity: 0, transform: 'translateY(4px) scale(0.95)' }"
      :transition="{ duration: 0.2, ease: 'easeOut' }"
      :style="tooltipStyle"
    >
      <div v-html="content" />
      <div :class="['arrow', `arrow-${position}`]" :style="arrowStyle" />
    </motion.div>
    </AnimatePresence>
  </Teleport>
</template>

<script lang="ts" setup>
import type { TooltipProps } from "./types";
import { ref, watch, nextTick, type ComponentPublicInstance } from "vue";
import { motion, AnimatePresence } from "motion-v";

const props = withDefaults(defineProps<TooltipProps>(), {
  position: "top"
});

const tooltip = ref(null as ComponentPublicInstance | null);
const target = ref(null as HTMLDivElement | null);
const tooltipStyle = ref<Record<string, string>>({ position: "fixed", top: "-9999px", left: "-9999px" });
const arrowStyle = ref<Record<string, string>>({});
const isVisible = ref(false);

const mouseenter = () => {
  isVisible.value = true;
  nextTick(() => requestAnimationFrame(calculateTooltipPosition));
};

const mouseleave = () => {
  isVisible.value = false;
};


const calculateTooltipPosition = () => {
  const offset = 10; // Offset between the tooltip and the target element

  if (!target.value || !tooltip.value) return;

  const rect = target.value.getBoundingClientRect();
  const tooltipEl = tooltip.value?.$el as HTMLElement;
  const tooltipWidth = tooltipEl.offsetWidth;
  const tooltipHeight = tooltipEl.offsetHeight;
  const viewportWidth = window.innerWidth;

  const margin = 8;
  let top: number, left: number;

  switch (props.position) {
    case "top":
    case "bottom":
      top = props.position === "top"
        ? rect.top - tooltipHeight - offset
        : rect.bottom + offset;
      left = rect.left + rect.width / 2 - tooltipWidth / 2;
      left = Math.max(margin, Math.min(left, viewportWidth - tooltipWidth - margin));

      // Shift arrow to point at the target center
      arrowStyle.value = { left: `${rect.left + rect.width / 2 - left}px`, translate: "-50% 0" };
      break;
    case "left":
      top = rect.top + rect.height / 2 - tooltipHeight / 2;
      left = rect.left - tooltipWidth - offset;
      arrowStyle.value = {};
      break;
    case "right":
      top = rect.top + rect.height / 2 - tooltipHeight / 2;
      left = rect.right + offset;
      arrowStyle.value = {};
      break;
  }

  tooltipStyle.value = {
    top: `${top!}px`,
    left: `${left!}px`,
    position: "fixed"
  };
};

watch(() => [target.value, props.position], calculateTooltipPosition);
</script>

<style lang="scss" scoped>
.tooltip-cursor {
  opacity: 0;
}

.arrow {
  position: absolute;
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--color-neutral-bg-inverted-2);
  transform: rotate(45deg);

  &-top    { bottom: -0.25rem; left: 50%; translate: -50% 0; }
  &-bottom { top: -0.25rem;    left: 50%; translate: -50% 0; }
  &-left   { right: -0.25rem; top: 50%;  translate: 0 -50%; }
  &-right  { left: -0.25rem;  top: 50%;  translate: 0 -50%; }
}
</style>
