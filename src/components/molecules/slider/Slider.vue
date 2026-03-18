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
                width: containerWidth + 'px'
              }
            ]"
            class="flex h-full px-1"
          >
            <span
              v-for="index in positions_data"
              :key="index"
              class="test flex items-center"
              :style="{ width: `calc(${midPosition ?? 100 / positions_data}%)` }"
            >
              <span class="h-[4px] w-[4px] rounded-full bg-white"> </span>
            </span>

            <span
              v-if="midPosition"
              class="flex items-center"
              :style="{ width: `calc(${100 - midPosition}%)` }"
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
              :style="{ width: `calc(${midPosition ?? 100 / positions_data}%)` }"
              class="flex items-center"
            >
              <span class="h-[4px] w-[4px] rounded-full bg-neutral-bg-4"> </span>
            </span>
            <span
              v-if="midPosition"
              class="flex items-center"
              :style="{ width: `calc(${100 - midPosition}%)` }"
            >
              <span class="h-[4px] w-[4px] rounded-full bg-neutral-bg-4"> </span>
            </span>
            <span class="flex items-center">
              <span class="h-[4px] w-[4px] rounded-full bg-neutral-bg-4"> </span>
            </span>
          </div>
        </div>
      </div>
      <div ref="buttonWrapper" class="absolute top-1/2 z-2 -translate-y-1/2">
        <Tooltip ref="buttonTooltip" :content="`${Math.round(leasePercent)}%`" position="top" :rotate-value="rotateValue" :force-visible="dragStart">
          <button
            ref="button"
            class="flex h-10 w-10 items-center justify-center gap-0.5 rounded-full border-2 border-neutral-bg-2 bg-primary-default cursor-pointer origin-center hover:bg-primary-hover active:bg-primary-active active:scale-[115%] transition duration-75 ease-out"
            draggable="true"
            type="button"
          >
            <span class="triangle triangle-right bg-white"></span>
            <span class="triangle triangle-left bg-white"></span>
          </button>
        </Tooltip>
      </div>
    </div>
    <div class="relative mt-4 flex justify-between">
      <span
        class="cursor-pointer select-none text-14 text-typography-secondary"
        @click="onClickLeftLabel?.()"
      >
        {{ labelLeft }}
      </span>
      <span
        v-if="labelMid && midPosition"
        class="absolute cursor-pointer select-none text-14 text-typography-secondary"
        :style="[
          {
            top: `-64px`,
            left: `calc(${midPosition ?? 100 / positions_data}% - 15px)`
          }
        ]"
        @click="onClickMidLabel?.()"
      >
        {{ labelMid }}
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
import { computed, nextTick, onMounted, onUnmounted, ref, watch, type ComponentPublicInstance } from "vue";
import type { RangeProps } from "./types";
import Tooltip from "@/components/atoms/tooltip/Tooltip.vue";
import { useMotionValue, useVelocity, useSpring, useTransform } from "motion-v";

const xPercent = useMotionValue(0);
const xVelocity = useVelocity(xPercent);
const smoothVelocity = useSpring(xVelocity, { damping: 30, stiffness: 200 });
const rotateValue = useTransform(smoothVelocity, [-300, 300], [25, -25]);

const props = withDefaults(defineProps<RangeProps>(), {
  minPosition: 25,
  maxPosition: 150,
  disabled: false
});

const emits = defineEmits(["onDrag"]);
const defaultPosition = 100;
const percentPosition = computed(() => (props.positions ? 100 / props.positions : 1));

let position = defaultPosition;
const dragStart = ref(false);
let scalePercent = props.maxPosition;
let leasePercent = ref(0);

const button = ref<HTMLButtonElement>();
const buttonWrapper = ref<HTMLDivElement>();
const buttonTooltip = ref<ComponentPublicInstance & { recalculate: () => void }>();
const container = ref<HTMLDivElement>();
const background = ref<HTMLDivElement>();
const containerWidth = ref(0);

const wrapperEl = () => buttonWrapper.value;
const buttonEl = () => button.value;

function updateContainerWidth() {
  if (container.value) {
    containerWidth.value = container.value.offsetWidth;
  }
}

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  setPosition(props.value);
  nextTick(() => updateContainerWidth());
  if (container.value) {
    resizeObserver = new ResizeObserver(() => updateContainerWidth());
    resizeObserver.observe(container.value);
  }
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseLeave);
});

onUnmounted(() => {
  resizeObserver?.disconnect();
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
  const wrapper = wrapperEl();
  if (element) {
    element.style.width = position != null ? `${position}%` : "100%";
  }
  if (wrapper) {
    wrapper.style.left = `calc( ${position != null ? position : defaultPosition}% - 18px )`;
  }
  position = position ?? defaultPosition;

  const diff = props.maxPosition - props.minPosition;
  const percent = (position * diff) / 100 + props.minPosition;
  leasePercent.value = percent;
}

function onMouseLeave(event: MouseEvent | TouchEvent) {
  event.preventDefault();
  if (dragStart.value) {
    release();
  }
  dragStart.value = false;
}

function onMouseDown(event: MouseEvent | TouchEvent) {
  event.preventDefault();

  removeAnimations();

  if (props.disabled) {
    return false;
  }

  const draggable = buttonEl();
  const parentRect = container.value?.getBoundingClientRect();

  if (!draggable) {
    return false;
  }

  if (!parentRect) {
    return false;
  }

  const draggableRect = buttonEl()!.getBoundingClientRect();
  let xPos = 0;

  switch (event.constructor) {
    case MouseEvent: {
      xPos = (event as MouseEvent).x;
      break;
    }
    case TouchEvent: {
      const [touche] = (event as TouchEvent).touches;
      xPos = touche!.clientX;
      break;
    }
  }

  if (draggableRect) {
    if (event.target != buttonEl()) {
      position = draggableRect.width / 2;
      setPercent(xPos, parentRect!, draggableRect);
      dragStart.value = true;
      return false;
    }

    position = xPos - draggableRect.x;
  }

  dragStart.value = true;
}

function onMouseMove(event: MouseEvent | TouchEvent) {
  const draggableRect = buttonEl()?.getBoundingClientRect();

  if (dragStart.value && draggableRect && container.value && buttonEl()) {
    event.preventDefault();
    const parentRect = container.value?.getBoundingClientRect();
    let xPos = 0;

    switch (event.constructor) {
      case MouseEvent: {
        xPos = (event as MouseEvent).x;
        break;
      }
      case TouchEvent: {
        const [touche] = (event as TouchEvent).touches;
        xPos = touche!.clientX;
        break;
      }
    }

    setPercent(xPos, parentRect, draggableRect);
  }
}

function setPercent(xPos: number, parentRect: DOMRect, draggableRect: DOMRect) {
  const widthDragable = draggableRect.width / 2;
  const x = Math.max(-widthDragable, Math.min(xPos - parentRect.left - position, parentRect.width - widthDragable));

  const prc = ((x + draggableRect.width / 2) / parentRect.width) * 100;
  const scale = Math.round(prc / percentPosition.value);
  if (props.positions) {
    leasePercent.value = scale * props.minPosition + props.minPosition;
  } else {
    leasePercent.value = scale;
  }
  scalePercent = Math.round(scale * percentPosition.value);
  wrapperEl()!.style.left = `${x}px`;
  xPercent.set(prc);
  buttonTooltip.value?.recalculate();

  if (background.value) {
    background.value.style.width = `${prc}%`;
  }
}

function release() {
  const element = background.value;
  const wrapper = wrapperEl();
  const snapTrackDuration = 400;
  if (element) {
    element.style.width = `${scalePercent < 0 ? 0 : scalePercent}%`;
    element.style.transition = `width ${snapTrackDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
  }
  if (wrapper) {
    wrapper.style.left = `calc( ${scalePercent > 100 ? 100 : scalePercent}% - 18px )`;
    wrapper.style.transition = `left ${snapTrackDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
  }
  emits("onDrag", leasePercent.value);

  const startTime = performance.now();
  const trackSnap = () => {
    buttonTooltip.value?.recalculate();
    if (performance.now() - startTime < snapTrackDuration) {
      requestAnimationFrame(trackSnap);
    }
  };
  requestAnimationFrame(trackSnap);
}

function removeAnimations() {
  const element = background.value;
  const wrapper = wrapperEl();
  if (element) {
    element.style.transition = "none";
  }
  if (wrapper) {
    wrapper.style.transition = "none";
  }
}
</script>

<style lang="scss" scoped>
.triangle {
  position: relative;
  text-align: left;
}
.triangle:before,
.triangle:after {
  position: absolute;
  background-color: inherit;
  content: "";
}
.triangle,
.triangle:before,
.triangle:after {
  margin-bottom: 3px;
  height: 5px;
  width: 5px;
  border-top-right-radius: 40%;
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
