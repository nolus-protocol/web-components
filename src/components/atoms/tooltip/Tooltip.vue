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
      <div class="relative flex">
        <span
          class="text-normal whitespace-no-wrap content bg-light-electric shadow-lg relative z-10 p-2 text-left leading-none text-white"
        >
          {{ content }}
        </span>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const tooltip = ref(null as HTMLDivElement | null);
const target = ref(null as HTMLDivElement | null);

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

  if (!element) {
    return false;
  }

  if (target.value) {
    const rect = parent.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const left = rect.left + window.scrollX - elementRect.width / 2 + rect.width / 2;
    const top = rect.top + window.scrollY - elementRect.height - 10;

    const maxWidth = window.innerWidth;

    element.style.left = `${left}px`;
    element.style.top = `${top}px`;

    if (left + elementRect.width > maxWidth) {
      element.style.left = `${window.innerWidth - elementRect.width - 10}px`;
    }

    if (left < 0) {
      element.style.left = `10px`;
    }
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
</script>
<style lang="scss" scoped>
.bg-light-electric {
  @apply bg-primary-50;
}

.group-tooltip {
  font-size: 10px;
  line-height: 14px;
  cursor: pointer;

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
  width: 196px;
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

  &:after {
    @apply bg-light-electric absolute -bottom-1 left-0 right-0 m-auto h-3 w-3 rotate-45;
    content: "";
  }
}
</style>
