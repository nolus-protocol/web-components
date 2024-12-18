<template>
  <div
    ref="dialog"
    class="invisible fixed left-0 right-0 top-0 z-[9998] flex min-h-dvh items-center justify-center bg-neutral-bg-inverted-1/50 opacity-0 md:fixed md:bottom-0"
    @keydown.esc="close"
  >
    <div
      ref="dialogChild"
      class="flex min-h-dvh w-full flex-col bg-neutral-bg-2 shadow-larger md:min-h-0 md:max-w-[512px] md:rounded-xl md:border md:border-border-default"
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
        <slot :name="'tab-content-' + activeTabIdx" />
      </template>
      <template v-else>
        <!--        <div class="flex-1 px-6 pb-6">-->
        <slot name="content" />
        <!--        </div>-->
        <div
          v-if="$slots.footer"
          class="border-t border-border-default p-6"
        >
          <slot name="footer" />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, provide, ref } from "vue";
import { Radio } from "@/components";

const dialog = ref<HTMLDivElement>();
const dialogChild = ref<HTMLDivElement>();
const radioRefs = ref<InstanceType<typeof Radio>[]>([]);

export interface DialogProps {
  title: string;
  tabs?: { label: string; disabled?: boolean }[];
  activeTabIndex?: number;
  showClose?: boolean;
}

const props = withDefaults(defineProps<DialogProps>(), {});

const emit = defineEmits(["close-dialog"]);
const disable = ref(false);
const activeTabIdx = ref(props.activeTabIndex ?? 0);

onMounted(() => {
  const element = dialog.value;

  if (element) {
    element.style.animation = "fadeInAnimation 200ms";
  }

  if (props.tabs) {
    const el = radioRefs.value[activeTabIdx.value].$el.querySelector('input[type="radio"]') as HTMLElement;
    if (el) {
      el!.click();
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

const handleClickOutside = (event: MouseEvent) => {
  if (event.target === dialog.value) {
    close();
  }
};

const handleParentClick = (index: number) => {
  const radioElement = radioRefs.value[index].$el.querySelector('input[type="radio"]') as HTMLElement;
  if (radioElement) {
    radioElement.click();
    activeTabIdx.value = index;
  }
};

provide("show", show);
provide("close", close);

defineExpose({
  show,
  close
});
</script>
