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
      <img
        v-if="type === NotificationBoxType.warning"
        :alt="NotificationBoxType.warning"
        class="h-5 w-8"
        src="@/assets/icons/information-circle.svg"
      />
    </div>
    <div class="text-left text-14 font-normal text-neutral-typography-200">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { NotificationBox, NotificationBoxType } from "./types";

const props = defineProps<NotificationBox>();

const classes = computed(() => ({
  "bg-warning-50": props.type === NotificationBoxType.warning,
  "bg-danger-50": props.type === NotificationBoxType.error
}));
</script>

<style lang="scss" scoped></style>
