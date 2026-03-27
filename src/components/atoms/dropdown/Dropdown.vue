<template>
  <div
    :id="`dropdown-${id}`"
    ref="dropdownRef"
    class="field-wrapper"
  >
    <FieldLabel :label="label" :for-id="`dropdown-btn-${id}`" class="mb-1" />
    <button
      :id="`dropdown-btn-${id}`"
      class="
        flex h-10 gap-2 items-center rounded-md border border-border-dominant bg-neutral-bg-2 text-16 font-normal text-typography-default shadow-small
        outline-transparent focus-visible:outline focus-visible:outline-border-focus focus-visible:border-border-focus
        transition duration-150 ease-out
      "
      :class="[{
        'px-2 py-1': props.size === Size.small,
        'px-3 py-2': props.size === Size.medium,

        'border-border-focus bg-secondary-active': isOpen,
        'border-border-error! text-typography-error': error
      }, $attrs.class]"
      :disabled="disabled"
      role="combobox"
      :aria-expanded="isOpen"
      :aria-controls="`dropdown-list-${id}`"
      aria-haspopup="listbox"
      type="button"
      @click="toggleDropdown"
    >
      <span class="flex flex-1 items-center">
        <img
          v-if="selectedOption?.icon"
          :alt="selectedOption.label"
          :src="selectedOption.icon"
          class="mr-1 h-4 w-4"
        />
        <span
          v-if="selectedOption && selectedOption?.label && !hideText"
          class="leading-3.75"
        >
          {{ selectedOption.label }}
        </span>
        <span
          v-if="!selectedOption"
          class="leading-3.75"
          >{{ placeholder }}</span
        >
      </span>
      <Spinner v-if="isLoading" />
      <SvgIcon
        name="chevron-small-down"
        class="h-5 w-5 transition duration-150 ease-out"
        :class="error ? 'fill-icon-error' : 'fill-icon-default'"
      />  
    </button>
    <Teleport to="body">
      <AnimatePresence>
        <motion.div
          v-if="isOpen"
          ref="elements"
          :style="{ top: `${position.y}px`, left: `${position.x}px` }"
          :class="[
            'shadow-lg fixed z-9999 mt-2 min-w-48 max-w-full overflow-hidden rounded-lg border border-border-default bg-neutral-bg-2 text-typography-default shadow-lighter outline-0 focus-visible:bg-red-500',
            dropdownClassName,
            itemTemplate ? 'min-w-81.25' : '',
            isOpen ? '' : 'pointer-events-none opacity-0'
          ]"
          :initial="{ opacity: 0, transform: 'translateY(4px) scale(0.98)' }"
          :animate="{ opacity: 1, transform: 'translateY(0) scale(1)' }"
          :exit="{ opacity: 0, transform: 'translateY(4px) scale(0.98)' }"
          :transition="{ duration: 0.15, ease: 'easeOut' }"
        >
          <div
            v-if="dropdownLabel || searchable"
            class="flex flex-col gap-4 border-b border-border-default p-4"
          >
            <div
              v-if="dropdownLabel"
              class="flex justify-between"
            >
              <span class="flex-1 font-semibold">{{ dropdownLabel }}</span>
              <Button
                @click="isOpen = !isOpen"
                size="small"
                severity="tertiary"
                icon="close"
                class="p-0 absolute top-2 right-2"
              />
            </div>
            <Input
              v-if="searchable"
              id="search-input"
              ref="searchInputRef"
              :size="Size.medium"
              :type="InputType.search"
              :value="searchInput"
              @input="
                (e) => {
                  searchInput = (e.target as HTMLInputElement).value;
                }
              "
              @on-search-clear="
                (e) => {
                  e.stopPropagation();
                  searchInput = '';
                }
              "
            />
          </div>
          <div
            v-if="itemsHeadline"
            class="flex border-b-[1px] border-border-default bg-neutral-bg-1 p-3"
          >
            <span
              v-for="headline in itemsHeadline"
              :key="headline"
              class="flex-1 text-14 font-normal text-typography-default last-of-type:text-right"
              >{{ headline }}</span
            >
          </div>
          <ul :id="`dropdown-list-${id}`" role="listbox" class="scroll-bar flex max-h-62.5 flex-col gap-1 overflow-y-auto rounded-b-lg p-1" @keydown="onListKeydown">
            <template v-if="filteredItemTemplates.length > 0">
              <div class="flex flex-col gap-1">
                <component
                  :is="itemTemplate?.(option)"
                  v-for="option in filteredItemTemplates"
                  :key="option.value"
                  :class="{
                    'bg-primary-default text-typography-static-light': selectedOption?.value === option.value,
                    'pointer-events-none': option.disabled
                  }"
                  class="min-h-10 cursor-pointer hover:bg-primary-default hover:text-typography-static-light transition duration-150 ease-out rounded"
                  @click="selectOption(option)"
                ></component>
              </div>
            </template>
            <template v-else>
              <li
                v-for="option in filteredOptions"
                :key="option.value"
                :class="{ 'bg-primary-default text-typography-static-light focus-visible:border-neutral-bg-2': selectedOption?.value === option.value }"
                class="flex min-h-10 cursor-pointer items-center px-4 py-2 hover:bg-primary-default hover:text-typography-static-light transition duration-150 ease-out outline-transparent rounded border-2 border-transparent
                focus-visible:outline-2 focus-visible:outline-primary-default"
                role="option"
                tabindex="-1"
                @click="selectOption(option)"
              >
                <img
                  v-if="option.icon"
                  :alt="option.label"
                  :src="option.icon"
                  class="mr-3 h-6 w-6"
                  aria-hidden="true"
                />
                <span class="flex-1">{{ option.label }}</span>
              </li>
            </template>
          </ul>
        </motion.div>
      </AnimatePresence>
    </Teleport>
  </div>
</template>

<script generic="T extends DropdownOption" lang="ts" setup>
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch, type ComponentPublicInstance } from "vue";
import type { DropdownOption, DropdownProps } from "./types";
import { Size } from "@/shared/utils/types";
import { InputType } from "@/components/atoms/input/types";
import Spinner from "../spinner/Spinner.vue";
import Input from "../input/Input.vue";
import FieldLabel from "../field-label/FieldLabel.vue";
import { motion, AnimatePresence } from "motion-v";
import SvgIcon from "../svg-icon/SvgIcon.vue";
import Button from "../button/Button.vue";

const dropdownRef = ref<HTMLElement | null>(null);
const elements = ref(null as ComponentPublicInstance | null);
const elementsEl = computed(() => elements.value?.$el as HTMLElement | undefined);

const registerSafeElement = inject<((el: HTMLElement) => void) | null>("registerSafeElement", null);
const unregisterSafeElement = inject<((el: HTMLElement) => void) | null>("unregisterSafeElement", null);

watch(elementsEl, (newEl, oldEl) => {
  if (oldEl) unregisterSafeElement?.(oldEl);
  if (newEl) registerSafeElement?.(newEl);
});

onBeforeUnmount(() => {
  if (elementsEl.value) unregisterSafeElement?.(elementsEl.value);
});

const isOpen = ref(false);
const selectedOption = ref<DropdownOption | null>(null);

const position = ref<{ x: number; y: number }>({ x: 0, y: 0 });

const props = withDefaults(
  defineProps<
    DropdownProps & {
      options: T[];
      selected?: T;
      onSelect: (option: T) => void;
      itemsHeadline?: string[];
      itemTemplate?: (option?: T) => any;
    }
  >(),
  {
    size: Size.medium,
    hideText: false,
    position: "left"
  }
);

const searchInput = ref("");

const emit = defineEmits<{
  (e: "unmounted", func: () => void): void;
}>();

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    nextTick(() => {
      setPosition();
      requestAnimationFrame(() => {
        const list = document.getElementById(`dropdown-list-${props.id}`);
        const items = Array.from(list?.querySelectorAll('li') ?? []) as HTMLElement[];
        const selectedIndex = selectedOption.value
          ? filteredOptions.value.findIndex(o => o.value === selectedOption.value?.value)
          : -1;
        (items[selectedIndex] ?? items[0])?.focus();
      })
    });
    window.addEventListener("scroll", setPosition);
    document.getElementById("dialog-scroll")?.addEventListener("scroll", setPosition);
    window.addEventListener("pointerdown", handleClickOutside);
  } else {
    window.removeEventListener("scroll", setPosition);
    document.getElementById("dialog-scroll")?.removeEventListener("scroll", setPosition);
    window.removeEventListener("pointerdown", handleClickOutside);
  }
};

function onListKeydown(e: KeyboardEvent) {
  const list = document.getElementById(`dropdown-list-${props.id}`);
  if (!list) return;
  const items = Array.from(list.querySelectorAll('li')) as HTMLElement[];
  const current = document.activeElement as HTMLElement;
  const index = items.indexOf(current);

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    items[Math.min(index + 1, items.length - 1)]?.focus();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    items[Math.max(index - 1, 0)]?.focus();
  } else if (e.key === 'Escape') {
    document.addEventListener('keyup', (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') ev.stopPropagation();
    }, { capture: true, once: true });
    isOpen.value = false;
    dropdownRef.value?.querySelector('button')?.focus();
  } else if (e.key === 'Enter' || e.key === ' ') {
    current.click();
  }
}

function setPosition() {
  if (dropdownRef.value && elementsEl.value) {
    const rect = dropdownRef.value.getBoundingClientRect();
    const elementsRect = elementsEl.value.getBoundingClientRect();

    let x = rect.left;
    let y = rect.top + rect.height;
    if (props.position === "right") {
      x = rect.right - elementsRect.width;
    }

    position.value = {
      x,
      y
    };
  }
}

const selectOption = (option: T) => {
  searchInput.value = "";
  selectedOption.value = option;

  if (props.onSelect) {
    props.onSelect(option);
  }

  isOpen.value = false;
  window.removeEventListener("scroll", setPosition);
  document.getElementById("dialog-scroll")?.removeEventListener("scroll", setPosition);
  window.removeEventListener("pointerdown", handleClickOutside);
  setTimeout(() => dropdownRef.value?.querySelector<HTMLElement>('button')?.focus(), 0);
};

onMounted(() => {
  const option = props.options.find((option) => option.value === props.selected?.value);
  if (option) {
    selectedOption.value = option;
  }
});

onBeforeUnmount(() => {
  cleanup();
});

// Watch for changes in selectedValue prop and update selectedOption accordingly
watch(
  () => props.selected,
  (newVal) => {
    if (!newVal) {
      selectedOption.value = props.options[0] as T;

      if (props.onSelect) {
        props.onSelect(props.options[0] as T);
      }

      return;
    }

    const option = props.options.find((option) => option.value === newVal.value);

    if (option) {
      selectedOption.value = option;
    }
  }
);

const filteredOptions = computed(() => {
  if (searchInput.value.length > 0) {
    return props.options.filter((option) => option.label.toLowerCase().includes(searchInput.value.toLowerCase()));
  }
  return props.options;
});

const filteredItemTemplates = computed(() => {
  if (props.itemTemplate?.length) {
    if (searchInput.value.length > 0) {
      return props.options.filter((option) => {
        return (
          option.label.toLowerCase().includes(searchInput.value.toLowerCase()) ||
          option.value.toString().toLowerCase().includes(searchInput.value.toLowerCase()) ||
          option.ticker?.toString().toLowerCase().includes(searchInput.value.toLowerCase()) ||
          option.name?.toString().toLowerCase().includes(searchInput.value.toLowerCase()) ||
          option.shortName?.toString().toLowerCase().includes(searchInput.value.toLowerCase()) ||
          option.ibcData?.toString().toLowerCase().includes(searchInput.value.toLowerCase())
        );
      });
    }

    return props.options;
  }

  return [];
});

// Close dropdown when clicking/tapping outside
const handleClickOutside = (event: PointerEvent) => {
  if (!isOpen.value) return;
  if (elementsEl.value && elementsEl.value.contains(event.target as Node)) return;
  if (dropdownRef.value && dropdownRef.value.contains(event.target as Node)) return;
  isOpen.value = false;
  window.removeEventListener("pointerdown", handleClickOutside);
};

// Cleanup event listener on component unmount
const cleanup = () => {
  window.removeEventListener("scroll", setPosition);
  window.removeEventListener("pointerdown", handleClickOutside);
  document.getElementById("dialog-scroll")?.removeEventListener("scroll", setPosition);
};

// Emit cleanup function on component unmount
// This ensures we clean up the event listener when the component is removed from the DOM
// This is important to prevent memory leaks
emit("unmounted", cleanup);
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
