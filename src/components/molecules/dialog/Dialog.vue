<template>
  <Teleport to="body">
    <div
      ref="dialog"
      class="invisible fixed left-0 right-0 top-0 z-[9998] flex min-h-dvh items-center justify-center bg-neutral-bg-inverted-1/50 opacity-0 md:fixed md:bottom-0"
      @keydown.esc="close"
      telepo
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
          <slot name="content" />
          <div
            v-if="$slots.footer"
            class="border-t border-border-default p-6"
          >
            <slot name="footer" />
          </div>
        </template>
      </div>
    </div>
  </Teleport>
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
  disableClose?: boolean;
}

const props = withDefaults(defineProps<DialogProps>(), {});

const emit = defineEmits(["close-dialog", "change-tab"]);
const disable = ref(false);
const activeTabIdx = ref(props.activeTabIndex ?? 0);

onMounted(() => {
  if (props.tabs) {
    const el = radioRefs.value[activeTabIdx.value].$el.querySelector('input[type="radio"]') as HTMLInputElement;
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
  const element = dialog.value as HTMLDivElement;
  element.style.animation = "fadeInAnimation 200ms forwards";
  // document.body.style.position = "fixed";
  if (document.body.scrollHeight > document.body.clientHeight) {
    const scroll = window.scrollY;
    document.body.style.overflowY = "scroll";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scroll}px`;
  } else {
    document.body.style.overflowY = "hidden";
  }
  element.style.visibility = "visible";
};

function close() {
  const element = dialog.value as HTMLDivElement;
  element.style.animation = "fadeOutAnimation 200ms forwards";
  document.body.style.position = "unset";
  document.body.style.overflowY = "auto";

  if (document.body.style.top) {
    const scroll = Math.abs(parseInt(document.body.style.top));
    window.scroll({ top: scroll });
    document.body.style.removeProperty("top");
  }

  setTimeout(() => {
    emit("close-dialog");
    element.style.visibility = "hidden";
  }, 200);
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
