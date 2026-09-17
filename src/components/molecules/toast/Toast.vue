<template>
  <Transition
    name="toast"
    @after-leave="props.onClose?.()"
  >
    <div
      v-if="showToast"
      :style="presenceLayerStyle"
      :class="[classes]"
      class="relative flex items-center justify-between gap-2 rounded-xl py-2.5 ps-3 pe-2 text-sm text-static-light shadow-xl md:ps-5"
    >
      <div class="flex items-center gap-2 text-sm font-normal">
        <SvgIcon
          :default-color="false"
          :name="props.icon || defaultIcon"
          size="s"
          class="shrink-0"
        />
        <slot></slot>
      </div>
      <div class="flex items-center gap-2">
        <Button
          v-if="undoBtnProps"
          class="button-tertiary-static-light"
          :class="{
            'hover:text-success-emphasized!': props.type === ToastType.success,
            'hover:text-error-emphasized!': props.type === ToastType.error
          }"
          label="Undo"
          severity="tertiary"
          size="small"
          v-bind="undoBtnProps"
          @click="onUndoClick"
        />
        <Button
          class="button-tertiary-static-light"
          :class="{
            'hover:text-success-emphasized!': props.type === ToastType.success,
            'hover:text-error-emphasized!': props.type === ToastType.error
          }"
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
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { presenceLayerStyle } from "@/shared/utils/presence-layer";
import { type IToast, ToastType } from "./types";
import { Button } from "@/components";
import SvgIcon from "@/components/atoms/svg-icon/SvgIcon.vue";

const props = defineProps<IToast>();

const showToast = ref(true);
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

const defaultIcon = computed(() => {
  if (props.icon) return props.icon;
  return {
    [ToastType.success]: "check-solid",
    [ToastType.error]: "warning",
    [ToastType.info]: "info"
  }[props.type];
});

const onCloseAlert = () => {
  showToast.value = false;
};

const onUndoClick = () => {
  if (props.onUndo) {
    props.onUndo();
  }
};
</script>

<style lang="scss" scoped>
.toast-enter-active {
  transition:
    opacity 0.25s cubic-bezier(0.22, 1.2, 0.36, 1),
    transform 0.25s cubic-bezier(0.22, 1.2, 0.36, 1);
}

.toast-leave-active {
  transition:
    opacity 0.2s ease-in,
    transform 0.2s ease-in;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
