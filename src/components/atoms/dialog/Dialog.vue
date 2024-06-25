<template>
  <Teleport to="body">
    <div
      ref="dialog"
      class="fixed bottom-0 left-0 right-0 top-0 z-[999999999] flex items-center justify-center bg-neutral-600/10 backdrop-blur-[2px]"
      @keydown.esc="close"
    >
      <Close
        class="fixed right-5 top-5 z-[5]"
        @click="close"
      />

      <div
        class="mb-0 mt-0 max-h-[calc(100%-80px)] w-full max-w-[516px] overflow-hidden bg-neutral-bg-50 shadow-dialog md:rounded-xl lg:mb-12 lg:mt-12"
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";
import Close from "../close/Close.vue";

const dialog = ref<HTMLDivElement>();

const emit = defineEmits(["close-modal"]);
const disable = ref(false);

onMounted(() => {
  document.body.style.overflowY = "hidden";

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

function close() {
  const element = dialog.value;
  if (element) {
    element.style.animation = "fadeOutAnimation 200ms";
  }
  setTimeout(() => {
    emit("close-modal");
    document.body.style.overflowY = "auto";
  }, 100);
}
</script>
