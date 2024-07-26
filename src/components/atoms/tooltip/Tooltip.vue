<template>
  <div
    ref="target"
    class="group-tooltip group relative flex flex-col items-center"
    @mouseleave="mouseleave"
    @mouseover="mouseover"
  >
    <span
      :class="[$attrs.class]"
      class="icon icon-tooltip"
    ></span>
  </div>
  <Teleport to="body">
    <div
      ref="tooltip"
      class="tooltip tooltip-animations absolute flex flex-col items-center group-hover:flex"
    >
      <div class="relative flex flex-col">
        <span
          class="text-normal whitespace-no-wrap content bg-light-electric shadow-lg relative z-10 p-2 text-left leading-none text-white"
        >
          {{ content }}
        </span>
        <div
          ref="pointer"
          class="pointer"
        ></div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const tooltip = ref(null as HTMLDivElement | null);
const target = ref(null as HTMLDivElement | null);
const pointer = ref(null as HTMLDivElement | null);

let timeout: NodeJS.Timeout;

defineProps({
  content: {
    type: String,
    default: ""
  }
});

function mouseover(event: MouseEvent) {
  if (timeout) {
    clearTimeout(timeout);
  }

  const parent = target.value as HTMLDivElement;
  const element = tooltip.value as HTMLDivElement;
  // const triangleElement = triangle.value as HTMLDivElement;

  if (!element || !parent) {
    return false;
  }

  if (target.value) {
    const rect = parent.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    let left = rect.left + window.scrollX - elementRect.width / 2 + rect.width / 2;
    const top = rect.top + window.scrollY - elementRect.height - 10;

    const maxWidth = window.innerWidth;

    // Adjust the tooltip's position based on the viewport's width
    if (window.innerWidth < 768) {
      // Adjust this value as needed
      left = rect.left + window.scrollX - elementRect.width / 2;
    }

    element.style.left = `${left}px`;
    element.style.top = `${top}px`;

    if (left + elementRect.width > maxWidth) {
      element.style.left = `${window.innerWidth - elementRect.width - 10}px`;
    }

    if (left < 0) {
      element.style.left = `10px`;
    }

    positionPointer();
  }

  element.style.visibility = "visible";
  element.style.opacity = "1";
}

function mouseleave() {
  const element = tooltip.value as HTMLDivElement;
  if (element) {
    element.style.opacity = "0";
    timeout = setTimeout(() => {
      element.style.visibility = "hidden";
    }, 200);
  }
}

function positionPointer() {
  const parent = target.value as HTMLDivElement;
  const child = pointer.value as HTMLDivElement;

  // Get the position of the target element
  const targetRect = parent.getBoundingClientRect();

  // Calculate the position for the pointer
  const pointerTop = targetRect.top - child.offsetHeight - 5;
  const pointerLeft = targetRect.left + targetRect.width / 2 - child.offsetWidth / 2;

  // Set the position of the pointer
  child.style.top = `${pointerTop}px`;
  child.style.left = `${pointerLeft}px`;
}
</script>
<style lang="scss" scoped>
.bg-light-electric {
  @apply bg-primary-50;
}

.group-tooltip {
  font-size: 10px;
  line-height: 14px;
  cursor: pointer;
  overflow: hidden;

  .icon-tooltip {
    @apply text-neutral-typography-50;
    margin: 0;

    &::before {
      margin: 0;
    }

    &:hover {
      @apply text-primary-50;
    }
  }
}
.tooltip {
  //width: 196px;
  display: flex;
  visibility: hidden;
  left: 0;
  top: 0;
  z-index: 1111111111;
}

.tooltip-animations {
  transition: opacity 0.15s ease;
  opacity: 0;
}

span.content {
  border-radius: 4px;
  box-shadow: 0px 8px 48px rgba(7, 45, 99, 0.15);
  font-size: 10px;
  line-height: 14px;
  font-family: "Garet", sans-serif;
  font-weight: 500;
  text-transform: normal !important;
}

.pointer {
  @apply bg-light-electric fixed -bottom-1 left-0 right-0 h-3 w-3 rotate-45;
}
</style>
