<template>
  <div
    ref="target"
    class="text-typography-default"
    @click="show"
  >
    <slot name="parent"></slot>
  </div>
  <Teleport to="body">
    <div
      ref="popover"
      :style="[popoverStyle]"
      class="invisible fixed z-[999999999] flex h-screen w-full flex-col bg-neutral-bg-2 opacity-0 shadow-larger transition duration-200 md:h-fit md:max-w-[512px] md:rounded-xl md:border md:border-border-default"
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
      <div class="flex-1 px-4 pb-4">
        <slot name="content" />
      </div>
      <div
        v-if="$slots.footer"
        class="border-t border-border-default p-4"
      >
        <slot name="footer" />
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, provide, ref, watch } from "vue";
import type { PopoverProps } from "./types";

let timeout: NodeJS.Timeout;
const popover = ref<HTMLDivElement | null>(null);
const popoverStyle = ref({});
const disable = ref(false);

const props = withDefaults(defineProps<PopoverProps>(), {
  showClose: false,
  position: "bottom",
  top: 73
});

const target = ref<HTMLElement | null>(null);

const emit = defineEmits(["close-popover", "unmounted"]);

onMounted(() => {
  const element = popover.value;

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

function close() {
  const element = popover.value as HTMLDivElement;

  if (element) {
    element.style.opacity = "0";

    timeout = setTimeout(() => {
      emit("close-popover");
      element.style.visibility = "hidden";
    }, 200);
  }
}

const show = () => {
  if (timeout) {
    clearTimeout(timeout);
  }

  const element = popover.value as HTMLDivElement;

  calculatePopoverPosition();

  element.style.visibility = "visible";
  element.style.opacity = "1";
};

const calculatePopoverPosition = () => {
  if (!target.value || !popover.value) return;

  const rect = target.value.getBoundingClientRect();
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

watch(() => [target, props.position], calculatePopoverPosition);

const handleClickOutside = (event: MouseEvent) => {
  if (
    target.value &&
    !target.value.contains(event.target as Node) &&
    popover.value &&
    !popover.value.contains(event.target as Node)
  ) {
    close();
  }
};

provide("show", show);
provide("close", close);

defineExpose({
  show,
  close
});
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
