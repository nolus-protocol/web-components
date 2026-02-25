<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <AnimatePresence>
      <Motion
        v-if="isOpen"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1, transition: { duration: transitionDurationDecimal } }"
        :exit="{ opacity: 0, transition: { duration: transitionDurationDecimal, ease: 'easeIn' } }"
        class="fixed inset-0 z-[9997] bg-neutral-bg-inverted-1/50"
        @click="handleBackdropClick"
      />
    </AnimatePresence>
    <!-- Dialog -->
    <AnimatePresence>
      <Motion
        v-if="isOpen"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        :initial="{ opacity: 0, scale: 0.97, y: 24 }"
        :animate="{ opacity: 1, scale: 1, y: 0, transition: { duration: transitionDurationDecimal, ease: 'easeOut' } }"
        :exit="{
          opacity: 0,
          scale: 0.98,
          y: 24,
          transition: { duration: transitionDurationDecimal * 0.8, ease: 'easeIn' }
        }"
        :class="[
          'pointer-events-auto fixed inset-0 z-[9998] m-auto flex flex-col overscroll-contain bg-neutral-bg-2 shadow-larger md:rounded-xl md:border md:border-border-default',
          'h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] md:h-[800px] md:min-h-0 md:max-w-[512px]',
          classList
        ]"
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
          <div class="flex border-b border-t border-border-color">
            <Radio
              v-for="(tab, index) in tabs"
              :id="`tab-${index}`"
              :key="index"
              ref="radioRefs"
              :class="[{ 'border-l border-border-color': index > 0, 'bg-transparent': activeTabIdx === index }]"
              :disabled="tab.disabled"
              :label="tab.label"
              class="flex flex-1 cursor-pointer justify-center bg-neutral-bg-1 px-6 py-5 text-16 font-normal text-typography-default"
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
      </Motion>
    </AnimatePresence>
  </Teleport>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, provide, ref } from "vue";
import { Motion, AnimatePresence } from "motion-v";
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
};

const close = () => {
  if (props.disableClose) {
    return;
  }
  isOpen.value = false;

  if (document.body.style.top) {
    const scroll = Math.abs(parseInt(document.body.style.top));
    window.scroll({ top: scroll });
    document.body.style.removeProperty("top");
    document.body.style.removeProperty("position");
  }
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
