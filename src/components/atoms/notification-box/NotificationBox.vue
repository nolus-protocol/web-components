<template>
  <div
    :class="[classes]"
    class="flex gap-2.5 rounded-lg p-4"
  >
    <div class="">
      <i
        v-if="type === NotificationBoxType.error"
        class="icon icon-close text-[22px] leading-none text-danger-100"
      ></i>
      <WarningIcon v-if="type === NotificationBoxType.warning" />
    </div>
    <div class="text-left text-14 font-normal text-neutral-typography-200">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { type INotificationBox, NotificationBoxType } from "./types";
import WarningIcon from "../../../assets/icons/information-circle.svg";

const props = defineProps<INotificationBox>();

const classes = computed(() => ({
  "bg-warning-50": props.type === NotificationBoxType.warning,
  "bg-danger-50": props.type === NotificationBoxType.error
}));
</script>

<style lang="scss" scoped></style>
