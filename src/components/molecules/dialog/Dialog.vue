<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="dialog-backdrop">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9997] bg-neutral-bg-1/75"
        :style="presenceLayerStyle"
        @click="handleBackdropClick"
      />
    </Transition>
    <!-- Dialog -->
    <Transition name="dialog-panel">
      <div
        v-if="isOpen"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        :class="[
          'pointer-events-auto fixed inset-0 z-[9998] m-auto flex flex-col overscroll-contain bg-neutral-bg-2 shadow-larger md:rounded-xl md:border md:border-border-default',
          'h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] md:h-[800px] md:min-h-0 md:max-w-[512px]',
          classList
        ]"
        :style="presenceLayerStyle"
      >
        <header class="flex items-center justify-between p-6">
          <h2 class="text-2xl font-semibold text-typography-default">{{ title }}</h2>
          <slot name="header" />
          <Button
            v-if="showClose"
            severity="tertiary"
            icon="close"
            size="small"
            class="!p-2.5 text-icon-default"
            aria-label="Close"
            @click="close"
          />
        </header>
        <template v-if="tabs?.length">
          <div class="flex gap-px border-t border-border-color bg-border-color">
            <Radio
              v-for="(tab, index) in tabs"
              :id="`tab-${index}`"
              :key="index"
              ref="radioRefs"
              :class="[
                {
                  'border-transparent': index === activeTabIdx,
                  'border-border-default': index !== activeTabIdx,
                  'bg-neutral-bg-2': activeTabIdx === index
                }
              ]"
              :disabled="tab.disabled"
              :label="tab.label"
              class="flex flex-1 cursor-pointer justify-center border-b bg-neutral-bg-1 px-6 py-5 text-16 font-normal text-typography-default"
              name="dialogTabsGroup"
              @click="handleParentClick(index)"
            />
          </div>
          <div class="flex h-[calc(100%-152px)] flex-col overflow-y-auto overscroll-contain">
            <slot :name="'tab-content-' + activeTabIdx" />
          </div>
        </template>
        <template v-else>
          <div class="flex h-[calc(100%-80px)] flex-col overflow-y-auto overscroll-contain">
            <slot name="content" />
            <div
              v-if="$slots.footer"
              class="border-t border-border-default p-6"
            >
              <slot name="footer" />
            </div>
          </div>
        </template>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, provide, ref } from "vue";
import { presenceLayerStyle } from "@/shared/utils/presence-layer";
import { Radio } from "@/components";
import Button from "../../atoms/button/Button.vue";

const isOpen = ref(false);
const transitionDuration = 200;
const transitionDurationDecimal = transitionDuration / 1000;
const radioRefs = ref<InstanceType<typeof Radio>[]>([]);

import type { DialogProps } from "./types";

const props = withDefaults(defineProps<DialogProps>(), {});

const emit = defineEmits(["close-dialog", "change-tab"]);
const disable = ref(false);
const activeTabIdx = ref(props.activeTabIndex ?? 0);

onMounted(() => {
  if (props.tabs) {
    setTimeout(() => {
      const el = radioRefs.value?.[activeTabIdx.value]?.$el.querySelector('input[type="radio"]') as HTMLInputElement;
      if (el) {
        el!.checked = true;
      }
    }, transitionDurationDecimal);
  }

  document.addEventListener("keyup", escapeClicked);
  window.addEventListener("popstate", backButtonClicked);
});

onUnmounted(() => {
  document.removeEventListener("keyup", escapeClicked);
  window.removeEventListener("popstate", backButtonClicked);
});

function escapeClicked(event: KeyboardEvent) {
  if (event.key == "Escape" && !disable.value && isOpen.value) {
    close();
  }
}

function backButtonClicked() {
  if (isOpen.value) {
    close();
  }
}

const show = () => {
  isOpen.value = true;
  document.documentElement.style.overflow = "hidden";
};

const close = () => {
  if (props.disableClose) {
    return;
  }
  isOpen.value = false;
  document.documentElement.style.overflow = "";
  setTimeout(() => {
    emit("close-dialog");
  }, transitionDuration);
};

const handleBackdropClick = () => {
  if (!props.disableClose) {
    close();
  }
};

const handleParentClick = (index: number) => {
  activeTabIdx.value = index;
  emit("change-tab", index);
};

provide("show", show);
provide("close", close);

defineExpose({
  show,
  close
});
</script>

<style lang="scss" scoped>
.dialog-backdrop-enter-active {
  transition: opacity 0.2s ease-out;
}

.dialog-backdrop-leave-active {
  transition: opacity 0.2s ease-in;
}

.dialog-backdrop-enter-from,
.dialog-backdrop-leave-to {
  opacity: 0;
}

.dialog-panel-enter-active {
  transition:
    opacity 0.2s ease-out,
    transform 0.2s ease-out;
}

.dialog-panel-leave-active {
  transition:
    opacity 0.16s ease-in,
    transform 0.16s ease-in;
}

.dialog-panel-enter-from {
  opacity: 0;
  transform: translateY(24px) scale(0.97);
}

.dialog-panel-leave-to {
  opacity: 0;
  transform: translateY(24px) scale(0.98);
}
</style>
