<template>
  <Teleport to="body">
    <dialog
      ref="dialog"
      aria-modal="true"
      :aria-label="title"
      :style="{ '--dialog-transition-duration': `${dialogTransition.transitionDuration}ms` }"
      class="
        flex-col bg-neutral-bg-2 md:border md:border-border-default shadow-larger md:rounded-xl overscroll-contain
        h-[100dvh] max-h-[100dvh] md:h-[800px] md:min-h-0 w-full max-w-[100vw] md:max-w-[512px] z-[9998] m-0
        hidden opacity-0
        open:flex open:opacity-100 open:scale-100 open:translate-y-0
        open:backdrop:bg-neutral-bg-inverted-1/50
      "
      :class="classList"
      @keydown.esc="close"
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
    </dialog>
  </Teleport>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, provide, ref } from "vue";
import { Radio } from "@/components";
import Button from "../../atoms/button/Button.vue";
import { spring } from "motion-v";

const dialog = ref<HTMLDialogElement>();
const dialogTransition = {
  transitionDuration: 200,
}
const radioRefs = ref<InstanceType<typeof Radio>[]>([]);

export interface DialogProps {
  title: string;
  tabs?: { label: string; disabled?: boolean }[];
  activeTabIndex?: number;
  showClose?: boolean;
  disableClose?: boolean;
  classList?: string;
}

const props = withDefaults(defineProps<DialogProps>(), {});

const emit = defineEmits(["close-dialog", "change-tab"]);
const disable = ref(false);
const activeTabIdx = ref(props.activeTabIndex ?? 0);

onMounted(() => {
  if (props.tabs) {
    const el = radioRefs.value?.[activeTabIdx.value]?.$el.querySelector('input[type="radio"]') as HTMLInputElement;
    if (el) {
      el!.checked = true;
    }
  }

  document.addEventListener("keyup", escapeClicked);
  window.addEventListener("popstate", backButtonClicked);
  window.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("keyup", escapeClicked);
  window.removeEventListener("popstate", backButtonClicked);
  window.removeEventListener("click", handleClickOutside);
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
  const element = dialog.value as HTMLDialogElement;
  element.showModal();
};

const close = () => {
  const element = dialog.value as HTMLDialogElement;
  if (element) {
    element.close();

    if (document.body.style.top) {
      const scroll = Math.abs(parseInt(document.body.style.top));
      window.scroll({ top: scroll });
      document.body.style.removeProperty("top");
      document.body.style.removeProperty("position");
    }
  }
  setTimeout(() => {
    emit("close-dialog");
  }, dialogTransition.transitionDuration);
}

const handleClickOutside = (event: MouseEvent) => {
  if (props.disableClose) {
    return false;
  }
  if (event.target === dialog.value) {
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

<style scoped>
/* TODO: Replace with Tailwind once we update to a Tailwind version that supports @starting-style */
dialog {
  transition: all var(--dialog-transition-duration) ease-out allow-discrete;
  transition-timing-function: var(--ease-out);
}

@starting-style {
  dialog[open] {
    opacity: 0;
    transform: scale(0.97) translateY(1.5rem);
  }
}

dialog::backdrop {
  background-color: transparent;
  transition: all var(--dialog-transition-duration) ease-out allow-discrete;
}
@starting-style {
  dialog:open::backdrop {
    background-color: transparent;
  }
}
</style>
