<template>
  <div
    ref="popover"
    :class="[
      'fixed z-[9997] flex h-screen max-h-[calc(100%-65px)] w-full flex-col overflow-y-hidden bg-neutral-bg-2 shadow-larger transition duration-200 md:h-fit md:w-auto md:max-w-[512px] md:rounded-xl md:border md:border-border-default',
      $attrs.class
    ]"
    :style="[popoverStyle]"
  >
    <div
      class="flex items-center justify-between p-4"
      v-if="title"
    >
      <span class="flex w-full justify-between text-24 font-semibold text-typography-default"
        >{{ title }} <slot name="title-content" />
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
  document.body.style.removeProperty("overflow-y");

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
    document.body.style.overflow = "hidden";

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
  document.body.style.removeProperty("overflow-y");
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
