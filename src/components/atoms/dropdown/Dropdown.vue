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
        <span v-if="selectedOption && selectedOption?.label && !hideText">
          {{ selectedOption.label }}
        </span>
        <span v-if="!selectedOption">{{ placeholder }}</span>
      </span>
      <Spinner v-if="isLoading" />
      <i
        :class="{ 'rotate-180': isOpen }"
        class="icon icon-picker leading-1 flex transform items-center text-[20px] text-icon-default transition duration-300 ease-in-out"
      />
    </button>
    <Transition name="fade">
      <div
        v-if="isOpen"
        :class="dropdownPosition === 'right' ? 'right-0' : 'left-0'"
        class="shadow-lg absolute top-full z-10 mt-3 w-full min-w-48 overflow-hidden rounded-lg border-[1px] border-border-default bg-neutral-bg-2 text-typography-default shadow-shadow-lighter"
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
        <ul class="flex max-h-[250px] flex-col overflow-y-auto rounded-b-lg">
          <template v-if="filteredItemTemplates.length > 0">
            <div class="flex flex-col gap-3">
              <component
                :is="itemTemplate?.(option)"
                v-for="option in filteredItemTemplates"
                :key="option.value"
                :class="{ 'bg-primary-default text-typography-static-light': selectedOption?.value === option.value }"
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
  </div>
</template>

<script generic="T extends DropdownOption" lang="ts" setup>
import { computed, ref, Transition, watch } from "vue";
import type { DropdownOption, DropdownProps } from "./types";
import Spinner from "../spinner/Spinner.vue";
import { Size } from "@/shared/utils/types";
import { InputType } from "@/components/atoms/input/types";
import Input from "../input/Input.vue";

const dropdownRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const selectedOption = ref<DropdownOption | null>(null);
const searchInputRef = ref<HTMLInputElement>();

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
    placeholder: "Select an option",
    size: Size.medium,
    hideText: false,
    dropdownPosition: "left"
  }
);

const searchInput = ref("");
const classes = computed(() => ({
  "px-2 py-1 focus:px-[7px] focus:py-[3px]": props.size === Size.small,
  "px-3 py-2 focus:px-[11px] focus:py-[7px]": props.size === Size.medium,

  "border-primary-50": isOpen,
  "!border-danger-100": props.error
}));

const emit = defineEmits<{
  (e: "unmounted", func: () => void): void;
}>();

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (option: T) => {
  searchInput.value = "";
  selectedOption.value = option;

  if (props.onSelect) {
    props.onSelect(option);
  }

  isOpen.value = false;
};

// Watch for changes in selectedValue prop and update selectedOption accordingly
watch(
  () => props.selected,
  (newVal) => {
    if (!newVal) {
      selectedOption.value = props.options[0];

      if (props.onSelect) {
        props.onSelect(props.options[0]);
      }

      return;
    }

    const option = props.options.find((option) => option.value === newVal.value);

    if (option) {
      selectedOption.value = option;
    }
  },
  { immediate: true }
);

watch(
  () => searchInput.value,
  (newVal) => {
    if (newVal) {
      selectedOption.value = null;
    }
  }
);

const filteredOptions = computed(() => {
  if (searchInput.value) {
    return props.options.filter((option) => option.label.toLowerCase().includes(searchInput.value.toLowerCase()));
  }
  return props.options;
});

const filteredItemTemplates = computed(() => {
  if (props.itemTemplate?.length) {
    return props.options;
  }
  return [];
});

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

// Listen for clicks outside the dropdown
window.addEventListener("click", handleClickOutside);

// Cleanup event listener on component unmount
const cleanup = () => {
  window.removeEventListener("click", handleClickOutside);
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
