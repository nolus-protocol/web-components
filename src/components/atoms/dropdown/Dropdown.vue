<template>
  <div
    :id="`dropdown-${id}`"
    ref="dropdownRef"
    class="field-wrapper"
  >
    <label
      v-if="props.label"
      :for="`dropdown-btn-${id}`"
      class="field-label mb-1"
      >{{ props.label }}</label
    >
    <button
      :id="`dropdown-btn-${id}`"
      :class="['field-dropdown', classes, $attrs.class]"
      :disabled="disabled"
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
          class="leading-[15px]"
        >
          {{ selectedOption.label }}
        </span>
        <span
          v-if="!selectedOption"
          class="leading-[15px]"
          >{{ placeholder }}</span
        >
      </span>
      <Spinner v-if="isLoading" />
      <i
        :class="{ 'rotate-180': isOpen }"
        class="icon icon-picker leading-1 flex transform items-center text-[20px] text-icon-default transition duration-300 ease-in-out"
      />
    </button>
    <Teleport to="body">
      <Transition name="fade">
        <div
          ref="elements"
          :style="[`top: ${position.y}px`, `left: ${position.x}px`]"
          :class="[
            'shadow-lg fixed z-[9999] mt-3 min-w-48 max-w-full overflow-hidden rounded-lg border-[1px] border-border-default bg-neutral-bg-2 text-typography-default shadow-lighter',
            dropdownClassName,
            itemTemplate ? 'min-w-[325px]' : '',
            isOpen ? '' : 'pointer-events-none opacity-0'
          ]"
        >
          <div
            v-if="dropdownLabel || searchable"
            class="flex flex-col gap-4 border-b-[1px] border-border-default p-4"
          >
            <div
              v-if="dropdownLabel"
              class="flex justify-between"
            >
              <span class="flex-1 font-semibold">{{ dropdownLabel }}</span>
              <i
                class="icon icon-close leading-1 flex cursor-pointer items-center text-[15px] text-icon-default"
                @click="isOpen = !isOpen"
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
          <ul class="scroll-bar flex max-h-[250px] flex-col overflow-y-auto rounded-b-lg">
            <template v-if="filteredItemTemplates.length > 0">
              <div class="flex flex-col">
                <component
                  :is="itemTemplate?.(option)"
                  v-for="option in filteredItemTemplates"
                  :key="option.value"
                  :class="{
                    'bg-primary-default text-typography-static-light': selectedOption?.value === option.value,
                    'pointer-events-none': option.disabled
                  }"
                  class="min-h-10 cursor-pointer hover:bg-primary-default hover:text-typography-static-light"
                  @click="selectOption(option)"
                ></component>
              </div>
            </template>
            <template v-else>
              <li
                v-for="option in filteredOptions"
                :key="option.value"
                :class="{ 'bg-primary-default text-typography-static-light': selectedOption?.value === option.value }"
                class="flex min-h-10 cursor-pointer items-center px-4 py-2 hover:bg-primary-default hover:text-typography-static-light"
                @click="selectOption(option)"
              >
                <img
                  v-if="option.icon"
                  :alt="option.label"
                  :src="option.icon"
                  class="mr-3 h-6 w-6"
                />
                <span class="flex-1">{{ option.label }}</span>
              </li>
            </template>
          </ul>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script generic="T extends DropdownOption" lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { DropdownOption, DropdownProps } from "./types";
import { Size } from "@/shared/utils/types";
import { InputType } from "@/components/atoms/input/types";
import Spinner from "../spinner/Spinner.vue";
import Input from "../input/Input.vue";

const dropdownRef = ref<HTMLElement | null>(null);
const elements = ref<HTMLElement | null>(null);

const isOpen = ref(false);
const selectedOption = ref<DropdownOption | null>(null);
const searchInputRef = ref<HTMLInputElement>();
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
const classes = computed(() => ({
  "px-2 py-1 focus:py-[3px]": props.size === Size.small,
  "px-3 py-2 focus:py-[7px]": props.size === Size.medium,

  "border-primary-50": isOpen.value,
  "!border-danger-100": props.error
}));

const emit = defineEmits<{
  (e: "unmounted", func: () => void): void;
}>();

const toggleDropdown = (event: MouseEvent) => {
  setPosition();
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    window.addEventListener("scroll", setPosition);
    document.getElementById("dialog-scroll")?.addEventListener("scroll", setPosition);
  } else {
    window.removeEventListener("scroll", setPosition);
    document.getElementById("dialog-scroll")?.removeEventListener("scroll", setPosition);
  }
};

function setPosition() {
  if (dropdownRef.value && elements.value) {
    const rect = dropdownRef.value.getBoundingClientRect();
    const elementsRect = elements.value.getBoundingClientRect();

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

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (elements.value && (elements.value == event.target || elements.value.contains(event.target as Node))) {
    return;
  }
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

// Listen for clicks outside the dropdown
window.addEventListener("click", handleClickOutside);

// Cleanup event listener on component unmount
const cleanup = () => {
  window.removeEventListener("scroll", setPosition);
  window.removeEventListener("click", handleClickOutside);
  document.getElementById("dialog-scroll")?.removeEventListener("scroll", setPosition);
};

// Emit cleanup function on component unmount
// This ensures we clean up the event listener when the component is removed from the DOM
// This is important to prevent memory leaks
emit("unmounted", cleanup);
</script>

<style lang="scss" scoped>
.rotate-180 {
  transform: rotateX(180deg);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
