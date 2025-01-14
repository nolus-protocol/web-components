<template>
  <div
    v-if="showToast"
    :class="[classes]"
    class="relative flex items-center justify-between rounded-xl p-3 text-white"
  >
    <div class="flex items-center gap-2 text-14 font-normal text-white">
      <i class="icon icon-success cursor-pointer text-[18px] leading-none text-white"></i>
      <slot></slot>
    </div>
    <div class="flex items-center gap-3">
      <Button
        class="!text-white hover:!text-typography-default"
        label="Undo"
        severity="tertiary"
        size="small"
        v-bind="undoBtnProps"
        v-if="undoBtnProps"
        @click="onUndoClick"
      />
      <i
        class="icon icon-close ml-2 cursor-pointer text-[18px] leading-none text-white"
        @click="onCloseAlert"
      ></i>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { type IToast, ToastType } from "./types";
import { Button } from "@/components";

const props = defineProps<IToast>();

const showToast = ref(true);

const classes = computed(() => ({
  "bg-error-emphasized": props.type === ToastType.error,
  "bg-success-emphasized": props.type === ToastType.success,
  "bg-neutral-bg-inverted-2": props.type === ToastType.info
}));

const onCloseAlert = () => {
  if (props.onClose) {
    props.onClose();
  }

  showToast.value = false;
};

const onUndoClick = () => {
  if (props.onUndo) {
    props.onUndo();
  }
};
</script>

<style lang="scss" scoped></style>
