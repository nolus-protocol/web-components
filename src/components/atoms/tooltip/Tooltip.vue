<template>
  <div
    ref="target"
    class="flex w-fit flex-col items-center text-typography-default"
    @mouseleave="mouseleave"
    @mouseenter="mouseenter"
  >
    <slot></slot>
  </div>
  <Teleport to="body">
    <Transition name="presence">
      <div
        v-if="isVisible"
        ref="tooltip"
        :class="[
          'relative z-9999 max-w-50 rounded bg-neutral-bg-inverted-2 px-2 py-1 text-xs text-typography-inverted',
          { [`tooltip-cursor tooltip-cursor-${position}`]: position },
          $attrs.class
        ]"
        :style="tooltipStyle"
      >
        <!-- eslint-disable-next-line vue/no-v-html -- content is rendered as HTML by contract (TooltipProps.content): callers sanitize it -->
        <div v-html="content" />
        <div
          :class="['arrow', `arrow-${position}`]"
          :style="arrowStyle"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import type { TooltipProps } from "./types";
import { ref, watch, nextTick, onUnmounted } from "vue";
import { presenceLayerStyle } from "@/shared/utils/presence-layer";

const props = withDefaults(defineProps<TooltipProps>(), {
  position: "top"
});

const tooltip = ref(null as HTMLElement | null);
const target = ref(null as HTMLDivElement | null);
const tooltipStyle = ref<Record<string, string>>({
  ...presenceLayerStyle,
  position: "fixed",
  top: "-9999px",
  left: "-9999px"
});
const arrowStyle = ref<Record<string, string>>({});

let unsubscribeRotation: (() => void) | null = null;
watch(
  () => props.rotateValue,
  (mv) => {
    unsubscribeRotation?.();
    unsubscribeRotation = null;
    if (!mv) return;
    unsubscribeRotation = mv.on("change", (v) => {
      const el = tooltip.value;
      if (el) {
        el.style.transformOrigin = "50% calc(100% + 10px)";
        el.style.rotate = `${v}deg`;
      }
    });
  },
  { immediate: true }
);
const isVisible = ref(false);
const isHovered = ref(false);

const MIN_VISIBLE_MS = 1000;

let hideTimeout: ReturnType<typeof setTimeout> | null = null;

const mouseenter = () => {
  isHovered.value = true;
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }
  isVisible.value = true;
  nextTick(() => requestAnimationFrame(calculateTooltipPosition));
};

const mouseleave = () => {
  isHovered.value = false;
  if (!props.forceVisible && !hideTimeout) {
    isVisible.value = false;
  }
};

watch(
  () => props.forceVisible,
  (val) => {
    if (val) {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }
      isVisible.value = true;
      nextTick(() => requestAnimationFrame(calculateTooltipPosition));
    } else {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }
      hideTimeout = setTimeout(() => {
        isVisible.value = false;
        hideTimeout = null;
      }, MIN_VISIBLE_MS);
    }
  },
  { flush: "sync" }
);
onUnmounted(() => {
  unsubscribeRotation?.();
  if (hideTimeout) clearTimeout(hideTimeout);
});

const calculateTooltipPosition = () => {
  const offset = 10; // Offset between the tooltip and the target element

  if (!target.value || !tooltip.value) return;

  const rect = target.value.getBoundingClientRect();
  const tooltipEl = tooltip.value;
  const tooltipWidth = tooltipEl.offsetWidth;
  const tooltipHeight = tooltipEl.offsetHeight;
  const viewportWidth = window.innerWidth;

  const margin = 8;
  let top: number, left: number;

  switch (props.position) {
    case "top":
    case "bottom":
      top = props.position === "top" ? rect.top - tooltipHeight - offset : rect.bottom + offset;
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
    ...presenceLayerStyle,
    top: `${top!}px`,
    left: `${left!}px`,
    position: "fixed"
  };

  // Also set directly on the DOM element to avoid Vue's render-cycle lag
  // (important when called from rAF loops during CSS transitions)
  if (tooltipEl) {
    tooltipEl.style.top = `${top!}px`;
    tooltipEl.style.left = `${left!}px`;
  }
};

watch(() => [target.value, props.position], calculateTooltipPosition);

defineExpose({ recalculate: calculateTooltipPosition });
</script>

<style lang="scss" scoped>
.presence-enter-active,
.presence-leave-active {
  transition:
    opacity 0.15s ease-out,
    transform 0.15s ease-out;
}

.presence-enter-from,
.presence-leave-to {
  opacity: 0;
  transform: translateY(4px) scale(0.98);
}

.arrow {
  position: absolute;
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--color-neutral-bg-inverted-2);
  transform: rotate(45deg);

  &-top {
    bottom: -0.25rem;
    left: 50%;
    translate: -50% 0;
  }
  &-bottom {
    top: -0.25rem;
    left: 50%;
    translate: -50% 0;
  }
  &-left {
    right: -0.25rem;
    top: 50%;
    translate: 0 -50%;
  }
  &-right {
    left: -0.25rem;
    top: 50%;
    translate: 0 -50%;
  }
}
</style>
