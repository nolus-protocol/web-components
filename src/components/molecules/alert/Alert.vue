<template>
  <div
    v-if="showAlert"
    :class="[classes]"
    class="relative flex items-start gap-2 rounded-xl p-3"
  >
    <div
      :class="[title ? 'h-5.5' : 'h-5']"
      class="flex shrink-0 items-center"
    >
      <SvgIcon
        :name="icon.name"
        :size="title ? 'm' : 'xs'"
        :default-color="false"
        :class="[icon.tone]"
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
import SvgIcon from "@/components/atoms/svg-icon/SvgIcon.vue";
import type { IconNames } from "@/components/atoms/svg-icon/types";

const props = defineProps<IAlert>();

const showAlert = ref(true);

const classes = computed(() => ({
  "bg-warning-muted": props.type === AlertType.warning,
  "bg-error-muted": props.type === AlertType.error,
  "bg-success-muted": props.type === AlertType.success,
  "bg-info-muted": props.type === AlertType.info
}));

const icons: Record<AlertType, { name: IconNames; tone: string }> = {
  [AlertType.error]: { name: "circle-x", tone: "fill-icon-error" },
  [AlertType.success]: { name: "check-solid", tone: "fill-icon-success" },
  [AlertType.info]: { name: "info", tone: "fill-icon-link" },
  [AlertType.warning]: { name: "warning", tone: "fill-typography-warning" }
};

const icon = computed(() => icons[props.type]);

const onCloseAlert = () => {
  if (props.onClose) {
    props.onClose();
  }

  showAlert.value = false;
};
</script>

<style lang="scss" scoped></style>
