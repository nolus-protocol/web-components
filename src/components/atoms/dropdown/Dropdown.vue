<template>
  <div
    :id="`dropdown-${id}`"
    ref="dropdownRef"
    class="field-wrapper"
  >
    <label
      v-if="label"
      :for="`dropdown-btn-${id}`"
      class="field-label"
      >{{ label }}</label
    >
    <button
      :id="`dropdown-btn-${id}`"
      :class="['field-dropdown', classes]"
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
        <span v-if="selectedOption && selectedOption?.label">
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
        class="shadow-lg absolute top-full z-10 mt-3 w-full overflow-hidden rounded-lg border-[1px] border-border-default bg-neutral-bg-2 text-typography-default shadow-shadow-lighter"
      >
        <div class="flex flex-col gap-4 border-b-[1px] border-border-default p-4">
          <div class="flex justify-between">
            <span class="flex-1 font-medium">{{ dropdownLabel }}</span>
            <i
              class="icon icon-close leading-1 flex cursor-pointer items-center text-[15px] text-icon-default"
              @click="isOpen = !isOpen"
            />
          </div>
          <Input
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
        <ul class="flex max-h-[250px] flex-col gap-3 overflow-y-auto rounded-b-lg">
          <li
            v-for="option in filteredOptions"
            :key="option.value"
            :class="{ 'bg-neutral-bg-100': selectedOption?.value === option.value }"
            class="flex cursor-pointer items-center px-4 py-2 hover:bg-neutral-bg-100"
            @click="selectOption(option)"
          >
            <img
              v-if="option.icon"
              :alt="option.label"
              :src="option.icon"
              class="mr-3 h-6 w-6"
            />
            {{ option.label }}
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
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

const props = withDefaults(defineProps<DropdownProps>(), {
  placeholder: "Select an option",
  dropdownLabel: "Select Token",
  size: Size.medium
});

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

const selectOption = (option: DropdownOption) => {
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

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

function focusOut() {
  setTimeout(() => {
    searchInput.value = "";
  }, 200);
}

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
