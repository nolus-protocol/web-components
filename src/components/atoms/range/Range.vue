<template>
  <div
    ref="container"
    class="relative mr-[16px] cursor-pointer sm:mr-[0px]"
    @mousedown="onMouseDown"
    @touchstart.passive="onMouseDown"
    @touchmove.passive="onMouseMove"
    @touchend="onMouseLeave"
  >
    <div class="relative flex h-[10px] w-full overflow-hidden rounded-[8px] bg-neutral-bg-100">
      <div
        ref="background"
        class="background-box"
      ></div>
      <div class="relative z-[2] flex w-full">
        <span
          class="small flex-1"
          v-for="_item of props.positions"
        ></span>
      </div>
    </div>
    <button
      ref="button"
      draggable="true"
      type="button"
    ></button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";

export interface RangeProps {
  positions: number;
  minPosiiton: number;
  maxPosition: number;
  disabled?: boolean;
}

const props = withDefaults(defineProps<RangeProps>(), {
  minPosiiton: 25,
  maxPosition: 150,
  positions: 5,
  disabled: false
});

const emits = defineEmits(["onDrag"]);
const defaultPosition = 100;
const percentPosition = 100 / props.positions;

let position = defaultPosition;
let dragStart = false;
let scalePercent = 150;

const button = ref<HTMLButtonElement>();
const container = ref<HTMLDivElement>();
const background = ref<HTMLDivElement>();

onMounted(() => {
  setDefault();
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseLeave);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseLeave);
});

function setDefault() {
  const element = background.value;
  const btnElement = button.value;
  if (element) {
    element.style.width = "100%";
  }
  if (btnElement) {
    btnElement.style.left = `calc( ${defaultPosition}% - 18px )`;
  }
  position = defaultPosition;
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
    const leasePercent = scale * props.maxPosition + props.minPosiiton;

    scalePercent = Math.round(scale * percentPosition);
    draggable.style.left = `${x}px`;
    emits("onDrag", leasePercent);

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
div.background-box {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 15%;
  background-color: var(--color-primary-50);
  z-index: 1;
  height: 10px;
}

span.small {
  &:not(:last-child) {
    border-right: solid 4px var(--color-background-50);
  }
}

button {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translate(0, -50%);
  z-index: 2;
  width: 36px;
  height: 36px;
  background-image: url("@/assets/icons/slider.svg");
}
</style>
