<template>
  <div
    ref="dialog"
    class="bg-neutral-bg-inverted-1/50 invisible fixed bottom-0 left-0 right-0 top-0 z-[999999999] flex items-center justify-center opacity-0"
    @keydown.esc="close"
  >
    <div
      class="flex h-screen w-full flex-col overflow-hidden bg-neutral-bg-2 shadow-larger md:h-fit md:max-w-[512px] md:rounded-xl md:border md:border-border-default"
    >
      <div class="flex items-center justify-between p-6">
        <span class="text-2xl font-semibold text-typography-default">{{ title }}</span>
        <slot name="header" />
        <i
          v-if="showClose"
          class="icon icon-close cursor-pointer text-[22px] leading-none text-icon-default"
          @click="close"
        ></i>
      </div>
      <div class="flex-1 px-6 pb-6">
        <slot name="content" />
      </div>
      <div
        v-if="$slots.footer"
        class="border-t border-border-default p-6"
      >
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, provide, ref } from "vue";

const dialog = ref<HTMLDivElement>();

const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  showClose: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["close-dialog"]);
const disable = ref(false);

onMounted(() => {
  const element = dialog.value;

  if (element) {
    element.style.animation = "fadeInAnimation 200ms";
  }

  document.addEventListener("keyup", escapeClicked);
  window.addEventListener("popstate", backButtonClicked);
});

onUnmounted(() => {
  document.removeEventListener("keyup", escapeClicked);
  window.removeEventListener("popstate", backButtonClicked);
});

function escapeClicked(event: KeyboardEvent) {
  if (event.key == "Escape" && !disable.value) {
    close();
  }
}

function backButtonClicked(event: Event) {
  close();
}

const show = () => {
  const element = dialog.value as HTMLDivElement;

  document.body.style.overflowY = "hidden";

  element.style.visibility = "visible";
  element.style.opacity = "1";
};

function close() {
  const element = dialog.value;

  if (element) {
    element.style.animation = "fadeOutAnimation 200ms";
    element.style.opacity = "0";
    element.style.visibility = "hidden";
  }

  setTimeout(() => {
    emit("close-dialog");
    document.body.style.overflowY = "auto";
  }, 100);
}

provide("show", show);
provide("close", close);

defineExpose({
  show,
  close
});
</script>
