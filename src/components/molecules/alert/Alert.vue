<template>
  <div
    v-if="showAlert"
    :class="[classes]"
    class="relative flex items-center gap-4 rounded-xl p-3"
  >
    <div>
      <i
        v-if="type === AlertType.error"
        class="icon icon-close flex h-[32px] w-[32px] items-center justify-center rounded-full bg-icon-error text-[22px] leading-none text-error-muted"
      ></i>
      <i
        v-if="type === AlertType.success"
        class="icon icon-success flex h-[32px] w-[32px] items-center justify-center rounded-full bg-icon-success text-[22px] leading-none text-success-muted"
      ></i>
      <InformationCircle
        v-if="type === AlertType.info"
        class="fill-icon-link"
      />
      <InformationTriangle
        v-if="type === AlertType.warning"
        class="fill-icon-warning"
      />
    </div>
    <div class="flex flex-col text-left text-14 font-normal text-typography-default">
      <span
        v-if="title"
        class="text-16 font-semibold"
        >{{ title }}</span
      >
      <slot name="content"></slot>
    </div>
    <i
      v-if="showClose"
      class="icon icon-close absolute top-2 right-2 cursor-pointer text-[22px] leading-none text-icon-default"
      @click="onCloseAlert"
    ></i>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { AlertType, type IAlert } from "./types";
import InformationCircle from "../../../assets/icons/information-circle.svg";
import InformationTriangle from "../../../assets/icons/information-triangle.svg";

const props = defineProps<IAlert>();

const showAlert = ref(true);

const classes = computed(() => ({
  "bg-warning-muted": props.type === AlertType.warning,
  "bg-error-muted": props.type === AlertType.error,
  "bg-success-muted": props.type === AlertType.success,
  "bg-info-muted": props.type === AlertType.info
}));

const onCloseAlert = () => {
  if (props.onClose) {
    props.onClose();
  }

  showAlert.value = false;
};
</script>

<style lang="scss" scoped></style>
