<template>
  <div
    ref="popover"
    :class="[
      'fixed z-[999999999] flex h-screen w-full flex-col bg-neutral-bg-2 shadow-larger transition duration-200 md:h-fit md:w-auto md:max-w-[512px] md:rounded-xl md:border md:border-border-default',
      $attrs.class
    ]"
    :style="[popoverStyle]"
  >
    <div class="flex items-center justify-between p-4">
      <span class="text-24 font-semibold text-typography-default">{{ title }}</span>
      <slot name="header" />
      <i
        v-if="showClose"
        class="icon icon-close cursor-pointer text-[22px] leading-none text-icon-default"
        @click="close"
      ></i>
    </div>
    <div
      v-if="$slots.content"
      class="flex-1"
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

const popover = ref<HTMLDivElement | null>(null);
const popoverStyle = ref({});
const disable = ref(false);

const props = withDefaults(defineProps<PopoverProps>(), {
  showClose: false,
  position: "bottom",
  top: 65
});

const target = ref<InstanceType<typeof props.parent | null>>(props.parent);

const emit = defineEmits(["close", "unmounted"]);

onMounted(() => {
  calculatePopoverPosition();

  document.addEventListener("keyup", escapeClicked);
  window.addEventListener("popstate", backButtonClicked);
  window.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("keyup", escapeClicked);
  window.removeEventListener("popstate", backButtonClicked);
  window.removeEventListener("click", handleClickOutside);
});

function escapeClicked(event: KeyboardEvent) {
  if (event.key == "Escape" && !disable.value) {
    close();
  }
}

function backButtonClicked(event: Event) {
  close();
}

const calculatePopoverPosition = () => {
  if (!target.value || !popover.value) return;

  const parent = target.value.$el;
  const rect = parent.getBoundingClientRect();
  const popoverWidth = popover.value.offsetWidth;
  const popoverHeight = popover.value.offsetHeight;

  let top, left;

  switch (props.position) {
    case "top":
      top = rect.top - popoverHeight - 10; // 10 is the offset
      left = rect.left + rect.width / 2 - popoverWidth / 2;
      break;
    case "bottom":
      top = rect.bottom + 10; // 10 is the offset
      left = rect.left + rect.width / 2 - popoverWidth / 2;
      break;
    case "left":
      top = rect.top + rect.height / 2 - popoverHeight / 2;
      left = rect.left - popoverWidth - 10; // 10 is the offset
      break;
    case "right":
      top = rect.top + rect.height / 2 - popoverHeight / 2;
      left = rect.right + 10; // 10 is the offset
      break;
    case "top-left":
      top = rect.top - popoverHeight - 10; // 10 is the offset
      left = rect.left;
      break;
    case "top-right":
      top = rect.top - popoverHeight - 10; // 10 is the offset
      left = rect.right - popoverWidth;
      break;
    case "bottom-left":
      top = rect.bottom + 10; // 10 is the offset
      left = rect.left;
      break;
    case "bottom-right":
      top = rect.bottom + 10; // 10 is the offset
      left = rect.right - popoverWidth;
      break;
  }

  // check if is on mobile
  if (window.innerWidth < 768) {
    popoverStyle.value = {
      top: `${props.top}px`,
      left: `0`
    };
  } else {
    popoverStyle.value = {
      top: `${top}px`,
      left: `${left}px`
    };
  }
};

watch(() => [props.parent, props.position], calculatePopoverPosition);

const close = () => {
  emit("close");
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    target.value.$el &&
    !target.value.$el.contains(event.target as Node) &&
    popover.value &&
    !popover.value.contains(event.target as Node)
  ) {
    close();
  }
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
