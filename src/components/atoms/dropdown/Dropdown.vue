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
          v-if="selectedOption && selectedOption.icon"
          :alt="selectedOption.label"
          :src="selectedOption.icon"
          class="mr-1 h-4 w-4"
        />
        {{ selectedOption ? selectedOption.label : placeholder }}
      </span>
      <i
        :class="{ 'rotate-180': isOpen }"
        class="icon icon-picker leading-1 transform text-[20px] text-neutral-400 transition duration-300 ease-in-out"
      />
    </button>
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="shadow-lg absolute top-full z-10 mt-1 w-full rounded-md border-[1px] border-border-color bg-neutral-bg-50 text-neutral-typography-200 shadow-field-heavy dark:hover:border-neutral-typography-100"
      >
        <ul class="max-h-[160px] overflow-y-auto p-2">
          <li
            v-for="option in options"
            :key="option.value"
            :class="{ 'bg-neutral-bg-100': selectedOption?.value === option.value }"
            class="mb-1 flex cursor-pointer items-center rounded-md px-1 py-2 hover:bg-neutral-bg-100"
            @click="selectOption(option)"
          >
            <img
              v-if="option.icon"
              :alt="option.label"
              :src="option.icon"
              class="mr-1 h-4 w-4"
            />
            {{ option.label }}
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, Transition } from "vue";

export interface DropdownOption {
  value: string | number;
  label: string;
  icon?: string;
}

export interface DropdownProps {
  id?: string;
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  error?: boolean;
  disabled?: boolean;
  onSelect?: (option: DropdownOption) => void;
}

const dropdownRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const selectedOption = ref<DropdownOption | null>(null);

const props = withDefaults(defineProps<DropdownProps>(), {
  id: "1",
  label: "Some Label",
  placeholder: "Select an option",
  options: undefined,
  error: false
});

const classes = computed(() => ({
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
  selectedOption.value = option;

  if (props.onSelect) {
    props.onSelect(option);
  }

  isOpen.value = false;
};

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
