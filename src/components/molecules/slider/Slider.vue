<template>
  <div>
    <div
      ref="container"
      class="relative mr-[16px] cursor-pointer sm:mr-[0px]"
      @mousedown="onMouseDown"
      @touchend="onMouseLeave"
      @touchstart.passive="onMouseDown"
      @touchmove.passive="onMouseMove"
    >
      <div class="relative flex h-[12px] w-full overflow-hidden rounded-full bg-neutral-bg-3">
        <div
          ref="background"
          class="absolute left-0 top-0 z-[2] h-[12px] w-[15%] overflow-hidden bg-primary-default"
        >
          <div
            :style="[
              {
                width: container?.offsetWidth + 'px'
              }
            ]"
            class="flex h-full px-1"
          >
            <span
              v-for="index in positions_data"
              :key="index"
              class="flex items-center"
              :style="{ width: `calc(100%/${positions_data})` }"
            >
              <span class="h-[4px] w-[4px] rounded-full bg-white"> </span>
            </span>
            <span class="flex items-center">
              <span class="h-[4px] w-[4px] rounded-full bg-white"> </span>
            </span>
          </div>
        </div>
        <div class="relative flex w-full">
          <div class="absolute flex h-full w-full px-1">
            <span
              v-for="index in positions_data"
              :key="index"
              :style="{ width: `calc(100%/${positions_data})` }"
              class="flex items-center"
            >
              <span class="h-[4px] w-[4px] rounded-full bg-neutral-bg-4"> </span>
            </span>
            <span class="flex items-center">
              <span class="h-[4px] w-[4px] rounded-full bg-neutral-bg-4"> </span>
            </span>
          </div>
        </div>
      </div>
      <button
        ref="button"
        class="absolute left-[18px] top-1/2 z-[2] flex h-[36px] w-[36px] -translate-y-1/2 transform items-center justify-center gap-0.5 rounded-full border-[1px] border-white bg-primary-default"
        draggable="true"
        type="button"
      >
        <span class="triangle triangle-right bg-white"></span>
        <span class="triangle triangle-left bg-white"></span>
      </button>
    </div>
    <div class="mt-4 flex justify-between">
      <span
        class="cursor-pointer select-none text-14 text-typography-secondary"
        @click="onClickLeftLabel?.()"
      >
        {{ labelLeft }}
      </span>
      <span
        class="cursor-pointer select-none text-14 text-typography-secondary"
        @click="onClickRightLabel?.()"
      >
        {{ labelRight }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

export interface RangeProps {
  labelLeft?: string;
  labelRight?: string;
  positions?: number;
  minPosition: number;
  maxPosition: number;
  disabled?: boolean;
  value?: number;
  onClickRightLabel?: Function;
  onClickLeftLabel?: Function;
}

const props = withDefaults(defineProps<RangeProps>(), {
  minPosition: 25,
  maxPosition: 150,
  disabled: false
});

const emits = defineEmits(["onDrag"]);
const defaultPosition = 100;
const percentPosition = props.positions ? 100 / props.positions : 1;

let position = defaultPosition;
let dragStart = false;
let scalePercent = props.maxPosition;
let leasePercent = 0;

const button = ref<HTMLButtonElement>();
const container = ref<HTMLDivElement>();
const background = ref<HTMLDivElement>();

onMounted(() => {
  setPosition(props.value);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseLeave);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseLeave);
});

watch(
  () => props.value,
  () => {
    setPosition(props.value);
  }
);

const positions_data = computed(() => {
  return props.positions ?? 1;
});

function setPosition(position?: number) {
  const element = background.value;
  const btnElement = button.value;
  if (element) {
    element.style.width = position != null ? `${position}%` : "100%";
  }
  if (btnElement) {
    btnElement.style.left = `calc( ${position != null ? position : defaultPosition}% - 18px )`;
  }
  position = position ?? defaultPosition;
}

function onMouseLeave(event: MouseEvent | TouchEvent) {
  event.preventDefault();
  if (dragStart) {
    release();
  }
  dragStart = false;
}

function onMouseDown(event: MouseEvent | TouchEvent) {
  event.preventDefault();

  removeAnimations();

  if (props.disabled) {
    return false;
  }

  const draggable = button.value!;
  const parentRect = container.value?.getBoundingClientRect();

  if (!draggable) {
    return false;
  }

  if (!parentRect) {
    return false;
  }

  const draggableRect = button.value!.getBoundingClientRect();
  let xPos = 0;

  switch (event.constructor) {
    case MouseEvent: {
      xPos = (event as MouseEvent).x;
      break;
    }
    case TouchEvent: {
      const [touche] = (event as TouchEvent).touches;
      xPos = touche.clientX;
      break;
    }
  }

  if (draggableRect) {
    if (event.target != button.value) {
      position = draggableRect.width / 2;
      setPercent(draggable, xPos, parentRect!, draggableRect);
      dragStart = true;
      return false;
    }

    position = xPos - draggableRect.x;
  }

  dragStart = true;
}

function onMouseMove(event: MouseEvent | TouchEvent) {
  const draggableRect = button.value?.getBoundingClientRect();

  if (dragStart && draggableRect && container.value && button.value) {
    event.preventDefault();
    const parentRect = container.value?.getBoundingClientRect();
    const draggable = button.value;
    let xPos = 0;

    switch (event.constructor) {
      case MouseEvent: {
        xPos = (event as MouseEvent).x;
        break;
      }
      case TouchEvent: {
        const [touche] = (event as TouchEvent).touches;
        xPos = touche.clientX;
        break;
      }
    }

    setPercent(draggable, xPos, parentRect, draggableRect);
  }
}

function setPercent(draggable: HTMLButtonElement, xPos: number, parentRect: DOMRect, draggableRect: DOMRect) {
  const x = xPos - parentRect.left - position;
  const widthDragable = draggableRect.width / 2;

  if (x > -widthDragable && x < parentRect.width - widthDragable) {
    const prc = ((x + draggableRect.width / 2) / parentRect.width) * 100;
    const percent = ((x + draggableRect.width / 2) / parentRect.width) * 100;
    const scale = Math.round(percent / percentPosition);
    if (props.positions) {
      leasePercent = scale * props.minPosition + props.minPosition;
    } else {
      leasePercent = scale;
    }
    scalePercent = Math.round(scale * percentPosition);
    draggable.style.left = `${x}px`;

    if (background.value) {
      background.value.style.width = `${prc}%`;
    }
  }
}

function release() {
  const element = background.value;
  const btnElement = button.value;
  if (element) {
    element.style.width = `${scalePercent < 0 ? 0 : scalePercent}%`;
    element.style.transition = "ease 200ms";
  }
  if (btnElement) {
    btnElement.style.left = `calc( ${scalePercent > 100 ? 100 : scalePercent}% - 18px )`;
    btnElement.style.transition = "ease 200ms";
  }
  emits("onDrag", leasePercent);
}

function removeAnimations() {
  const element = background.value;
  const btnElement = button.value;
  if (element) {
    element.style.transition = "none";
  }
  if (btnElement) {
    btnElement.style.transition = "none";
  }
}
</script>

<style lang="scss" scoped>
.triangle {
  @apply relative text-left;
}
.triangle:before,
.triangle:after {
  @apply absolute bg-inherit content-[""];
}
.triangle,
.triangle:before,
.triangle:after {
  @apply mb-[2px] h-[5px] w-[5px] rounded-tr-[60%];
}

.triangle {
  &-left {
    transform: rotate(-90deg) skewX(-30deg) scale(1, 0.866);
  }
  &-right {
    transform: rotate(-30deg) skewX(-30deg) scale(1, 0.866);
  }
}

.triangle:before {
  transform: rotate(-135deg) skewX(-45deg) scale(1.414, 0.707) translate(0, -50%);
}
.triangle:after {
  transform: rotate(135deg) skewY(-45deg) scale(0.707, 1.414) translate(50%);
}
</style>
