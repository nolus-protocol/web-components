<template>
  <Teleport to="body">
    <div
      ref="dialog"
      class="fixed bottom-0 left-0 right-0 top-0 z-[999999999] flex items-center justify-center bg-neutral-bg-3 backdrop-blur-[2px]"
      @keydown.esc="close"
    >
      <div
        class="flex h-screen w-full flex-col overflow-hidden border border-border-default bg-neutral-bg-2 shadow-larger md:h-fit md:max-w-[512px] md:rounded-xl"
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
        <div class="p-6">
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
  </Teleport>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";

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
