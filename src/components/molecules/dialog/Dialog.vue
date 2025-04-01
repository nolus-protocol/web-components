<template>
  <Teleport to="body">
    <div
      ref="dialog"
      class="invisible fixed left-0 right-0 top-0 z-[9998] flex items-center justify-center bg-neutral-bg-inverted-1/50 opacity-0 md:fixed md:bottom-0 md:h-auto"
      @keydown.esc="close"
    >
      <div
        ref="dialogChild"
        class="flex h-[100dvh] max-h-[100dvh] w-full flex-col bg-neutral-bg-2 shadow-larger md:h-[800px] md:min-h-0 md:max-w-[512px] md:rounded-xl md:border md:border-border-default"
        :class="classList"
      >
        <div class="flex items-center justify-between p-6">
          <span class="text-2xl font-semibold text-typography-default">{{ title }}</span>
          <slot name="header" />
          <Button
            v-if="showClose"
            severity="tertiary"
            icon="close"
            size="small"
            class="!p-2.5 text-icon-default"
            @click="close"
          />
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
          <div class="flex h-[calc(100%-152px)] flex-col overflow-y-auto">
            <slot :name="'tab-content-' + activeTabIdx" />
          </div>
        </template>
        <template v-else>
          <div class="flex h-[calc(100%-80px)] flex-col overflow-y-auto">
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
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, provide, ref } from "vue";
import { Radio } from "@/components";
import Button from "../../atoms/button/Button.vue";

const dialog = ref<HTMLDivElement>();
const dialogChild = ref<HTMLDivElement>();
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
  element.style.visibility = "visible";
};

function close() {
  const element = dialog.value as HTMLDivElement;
  if (element) {
    element.style.animation = "fadeOutAnimation 200ms forwards";
    document.body.style.removeProperty("overflow-y");

    if (document.body.style.top) {
      const scroll = Math.abs(parseInt(document.body.style.top));
      window.scroll({ top: scroll });
      document.body.style.removeProperty("top");
      document.body.style.removeProperty("position");
    }

    setTimeout(() => {
      emit("close-dialog");
      element.style.visibility = "hidden";
    }, 200);
  }
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
