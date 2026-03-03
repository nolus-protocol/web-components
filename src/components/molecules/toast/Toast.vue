<template>
  <AnimatePresence>
    <Motion
      v-if="showToast"
      :initial="{ opacity: 0, y: 8 }"
      :animate="{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 20 } }"
      :exit="{ opacity: 0, y: 8, transition: { type: 'spring', stiffness: 400, damping: 40 } }"
      :class="[classes]"
      class="relative flex items-center gap-2 justify-between rounded-xl py-2.5 ps-3 md:ps-5 pe-2 text-sm shadow-xl text-static-light"
    >
      <div class="flex items-center gap-2 text-sm font-normal">
        <SvgIcon
          :default-color="false"
          :name="props.icon || 'check-solid'"
          size="s"
          class="flex-shrink-0"
        />
        <slot></slot>
      </div>
      <div class="flex items-center gap-2">
        <Button
          class="button-tertiary-static-light"
          :class="
            { 'hover:text-success-emphasized!': props.type === ToastType.success, 'hover:text-error-emphasized!': props.type === ToastType.error }
          "
          label="Undo"
          severity="tertiary"
          size="small"
          v-bind="undoBtnProps"
          v-if="undoBtnProps"
          @click="onUndoClick"
        />
        <Button
          class="button-tertiary-static-light"
          :class="
            { 'hover:text-success-emphasized!': props.type === ToastType.success, 'hover:text-error-emphasized!': props.type === ToastType.error }
          "
          severity="tertiary"
          size="small"
          @click="onCloseAlert"
        >
          <SvgIcon
            :default-color="false"
            name="close"
            size="s"
          />
        </Button>
      </div>
    </Motion>
  </AnimatePresence>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { Motion, AnimatePresence } from "motion-v";
import { type IToast, ToastType } from "./types";
import { Button } from "@/components";
import SvgIcon from "@/components/atoms/svg-icon/SvgIcon.vue";

const props = defineProps<IToast>();

const showToast = ref(true);
const exitDuration = 400;

let timer: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
  if (props.timeout) {
    timer = setTimeout(onCloseAlert, props.timeout);
  }
});

onUnmounted(() => {
  if (timer) clearTimeout(timer);
});

const classes = computed(() => ({
  "bg-error-emphasized": props.type === ToastType.error,
  "bg-success-emphasized": props.type === ToastType.success,
  "bg-neutral-800": props.type === ToastType.info
}));

const onCloseAlert = () => {
  showToast.value = false;
  setTimeout(() => {
    if (props.onClose) props.onClose();
  }, exitDuration);
};

const onUndoClick = () => {
  if (props.onUndo) {
    props.onUndo();
  }
};
</script>