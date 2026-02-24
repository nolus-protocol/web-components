<template>
  <div
    ref="popover"
    @click.stop
    :class="[
      'fixed z-[9997] flex flex-col overflow-y-hidden bg-neutral-bg-2 shadow-larger transition duration-200',
      fullscreenOnMobile
        ? 'h-screen max-h-[calc(100%-65px)] w-full md:h-fit md:max-w-[512px] md:rounded-xl md:border md:border-border-default'
        : 'h-fit max-w-[512px] rounded-xl border border-border-default',
      $attrs.class
    ]"
    :style="[popoverStyle]"
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
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import type { PopoverProps } from "./types";
import Button from "../../atoms/button/Button.vue";

const popover = ref<HTMLDivElement | null>(null);
const popoverStyle = ref<Record<string, string>>({});
const disable = ref(false);

const props = withDefaults(defineProps<PopoverProps>(), {
  showClose: false,
  position: "bottom",
  top: 65,
  fullscreenOnMobile: true
});

const emit = defineEmits(["close", "unmounted"]);

onMounted(() => {
  calculatePopoverPosition();
  window.addEventListener("scroll", calculatePopoverPosition);
  document.addEventListener("keyup", escapeClicked);
  window.addEventListener("popstate", backButtonClicked);
  window.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("scroll", calculatePopoverPosition);
  document.removeEventListener("keyup", escapeClicked);
  window.removeEventListener("popstate", backButtonClicked);
  window.removeEventListener("click", handleClickOutside);
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
  const popEl = popover.value;

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

const close = () => {
  document.body.style.removeProperty("overflow-y");
  emit("close");
};

const handleClickOutside = (event: MouseEvent) => {
  const parentEl = getParentEl();
  const popEl = popover.value;
  if (!parentEl || !popEl) return;

  const target = event.target as Node;

  const clickedInsideParent = parentEl.contains(target);
  const clickedInsidePopover = popEl.contains(target);

  if (!clickedInsideParent && !clickedInsidePopover) {
    close();
  }
};

watch(
  () => [props.parent, props.position],
  () => calculatePopoverPosition
);
</script>
