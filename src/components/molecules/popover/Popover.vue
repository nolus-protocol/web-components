<template>
  <AnimatePresence>
    <motion.div
      v-if="isOpen"
      ref="popover"
      @click.stop
      :class="[
        'fixed z-9997 flex flex-col overflow-y-hidden bg-neutral-bg-2 shadow-larger',
        fullscreenOnMobile
          ? 'h-screen max-h-[calc(100%-65px)] w-full md:h-fit md:max-w-lg md:rounded-xl md:border md:border-border-default'
          : 'h-fit max-w-lg rounded-xl border border-border-default',
        $attrs.class
      ]"
      :style="popoverStyle"
      :initial="{ opacity: 0, scale: 0.98, y: 4 }"
      :animate="{ opacity: 1, scale: 1, y: 0 }"
      :exit="{
        opacity: 0,
        scale: 0.98,
        y: 4,
        transition: { duration: transitionDurationDecimal * 0.8, ease: 'easeIn' }
      }"
    >
      <div
        class="flex items-center justify-between p-4"
        v-if="title"
      >
        <span class="flex w-full justify-between text-24 font-semibold text-typography-default">
          {{ title }}
          <slot name="title-content" />
        </span>
        <slot name="header" />
        <Button
          v-if="showClose"
          severity="tertiary"
          icon="close"
          size="small"
          class="!p-2.5 text-icon-default"
          @click="close"
        />
      </div>

      <div
        v-if="$slots.content"
        class="h-[calc(100dvh-121px)] flex-1 overflow-y-auto md:h-auto md:!overflow-y-visible"
      >
        <slot name="content" />
      </div>

      <div
        v-if="$slots.footer"
        class="border-t border-border-default p-4"
      >
        <slot name="footer" />
      </div>
    </motion.div>
  </AnimatePresence>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, ref, watch, provide, type ComponentPublicInstance } from "vue";
import type { PopoverProps } from "./types";
import Button from "../../atoms/button/Button.vue";
import { AnimatePresence, motion } from "motion-v";

defineOptions({ inheritAttrs: false });

const isOpen = ref(false);
const popover = ref(null as ComponentPublicInstance | null);
const popoverStyle = ref<Record<string, string>>({});
const disable = ref(false);
const transitionDuration = 150;
const transitionDurationDecimal = transitionDuration / 1000;

const props = withDefaults(defineProps<PopoverProps>(), {
  showClose: false,
  position: "bottom",
  top: 65,
  fullscreenOnMobile: true
});

const emit = defineEmits(["open", "close", "unmounted"]);

onMounted(() => {
  requestAnimationFrame(calculatePopoverPosition);
  window.addEventListener("scroll", calculatePopoverPosition);
  document.addEventListener("keyup", escapeClicked);
  window.addEventListener("popstate", backButtonClicked);
  window.addEventListener("pointerdown", handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("scroll", calculatePopoverPosition);
  document.removeEventListener("keyup", escapeClicked);
  window.removeEventListener("popstate", backButtonClicked);
  window.removeEventListener("pointerdown", handleClickOutside);
});

function escapeClicked(event: KeyboardEvent) {
  if (event.key === "Escape" && !disable.value) {
    close();
  }
}

function backButtonClicked() {
  close();
}

const getParentEl = (): HTMLElement | null => {
  const parent = props.parent as any;
  if (!parent) return null;

  if (parent.$el) return parent.$el as HTMLElement;

  if (parent instanceof HTMLElement) return parent;

  return null;
};

const calculatePopoverPosition = () => {
  const parentEl = getParentEl();
  const popEl = popover.value?.$el as HTMLElement | null;

  if (!parentEl || !popEl) return;

  const rect = parentEl.getBoundingClientRect();
  const popoverWidth = popEl.offsetWidth;
  const popoverHeight = popEl.offsetHeight;

  let top = 0;
  let left = 0;

  switch (props.position) {
    case "top":
      top = rect.top - popoverHeight - 10;
      left = rect.left + rect.width / 2 - popoverWidth / 2;
      break;
    case "bottom":
      top = rect.bottom + 10;
      left = rect.left + rect.width / 2 - popoverWidth / 2;
      break;
    case "left":
      top = rect.top + rect.height / 2 - popoverHeight / 2;
      left = rect.left - popoverWidth - 10;
      break;
    case "right":
      top = rect.top + rect.height / 2 - popoverHeight / 2;
      left = rect.right + 10;
      break;
    case "top-left":
      top = rect.top - popoverHeight - 10;
      left = rect.left;
      break;
    case "top-right":
      top = rect.top - popoverHeight - 10;
      left = rect.right - popoverWidth;
      break;
    case "bottom-left":
      top = rect.bottom + 10;
      left = rect.left;
      break;
    case "bottom-right":
      top = rect.bottom + 10;
      left = rect.right - popoverWidth;
      break;
  }

  if (window.innerWidth < 768 && props.fullscreenOnMobile) {
    document.body.style.overflow = "hidden";
    popoverStyle.value = {
      top: `${props.top}px`,
      left: "0"
    };
  } else {
    popoverStyle.value = {
      top: `${top}px`,
      left: `${left}px`
    };
  }
};

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let previouslyFocused: HTMLElement | null = null;

const getFocusable = (): HTMLElement[] => {
  const popEl = popover.value?.$el as HTMLElement | null;
  if (!popEl) return [];
  return Array.from(popEl.querySelectorAll<HTMLElement>(FOCUSABLE));
};

const trapFocus = (event: KeyboardEvent) => {
  if (event.key !== 'Tab') return;
  const focusable = getFocusable();
  if (!focusable.length) return;
  const first = focusable[0]!;
  const last = focusable[focusable.length - 1]!;
  if (event.shiftKey) {
    if (document.activeElement === first) {
      event.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
};

const show = () => {
  previouslyFocused = document.activeElement as HTMLElement;
  popoverStyle.value = { visibility: "hidden" };
  isOpen.value = true;
  emit("open");
  nextTick(() => {
    calculatePopoverPosition();
    getFocusable()[0]?.focus();
  });
  document.addEventListener("keydown", trapFocus);
};

const close = () => {
  isOpen.value = false;
  document.body.style.removeProperty("overflow");
  document.removeEventListener("keydown", trapFocus);
  previouslyFocused?.focus();
  emit("close");
};

const toggle = () => {
  isOpen.value ? close() : show();
};

const handleClickOutside = (event: MouseEvent) => {
  const parentEl = getParentEl();
  const popEl = popover.value?.$el as HTMLElement | null;
  if (!parentEl || !popEl) return;

  const target = event.target as Node;

  const clickedInsideParent = parentEl.contains(target);
  const clickedInsidePopover = popEl.contains(target) || [...safeElements].some(el => el.contains(target));

  if (!clickedInsideParent && !clickedInsidePopover) {
    close();
  }
};

watch(
  () => [props.parent, props.position],
  () => calculatePopoverPosition()
);

const safeElements = new Set<HTMLElement>();
provide("registerSafeElement", (el: HTMLElement) => safeElements.add(el));
provide("unregisterSafeElement", (el: HTMLElement) => safeElements.delete(el));

provide("show", show);
provide("close", close);
provide("toggle", toggle);

defineExpose({
  show,
  close,
  toggle,
  isOpen
});
</script>
