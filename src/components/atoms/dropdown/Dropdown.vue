<template>
  <div :id="[`dropdown-${props.id}`]" class="relative flex flex-col item-center font-medium text-14">
    <label v-if="label" :for="[`dropdown-btn-${props.id}`]" class="cursor-pointer text-neutral-typography-200">{{ label }}</label>
    <button :id="[`dropdown-btn-${props.id}`]" :class="{ 'border-primary-50': isOpen }" class="flex rounded-md p-3 border-[1px] border-border-color text-neutral-typography-200 bg-neutral-bg-50 dark:hover:border-neutral-typography-100 items-center" type="button" @click="toggleDropdown">
      <span class="flex flex-1 items-center">
        <img v-if="selectedOption && selectedOption.icon" :alt="selectedOption.label" :src="selectedOption.icon" class="mr-1 w-4 h-4" />
        {{ selectedOption ? selectedOption.label : placeholder }}
      </span>
      <i :class="{ 'rotate-180': isOpen }" class="icon icon-picker text-[20px] leading-1 transform transition duration-300 ease-in-out text-neutral-400" />
    </button>
    <Transition name="fade">
      <div v-if="isOpen" class="absolute z-10 top-full mt-1 w-full border-[1px] border-border-color text-neutral-typography-200 bg-neutral-bg-50 dark:hover:border-neutral-typography-100 shadow-lg rounded-md">
        <ul class="p-2 max-h-[160px] overflow-y-auto">
          <li v-for="option in options" :key="option.value" :class="{ 'bg-neutral-bg-100': selectedOption?.value === option.value }" class="flex items-center cursor-pointer mb-1 px-1 py-2 hover:bg-neutral-bg-100 rounded-md" @click="selectOption(option)">
            <img v-if="option.icon" :alt="option.label" :src="option.icon" class="mr-1 w-4 h-4" /> {{ option.label }} </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, Transition } from 'vue'

export interface DropdownOption {
  value: string | number;
  label: string;
  icon?: string;
}

export interface DropdownProps {
  id: string;
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
}

const isOpen = ref(false)
const selectedOption = ref<DropdownOption | null>(null);

const props = withDefaults(defineProps<DropdownProps>(), {
  label: 'Some Label',
  placeholder: 'Select an option',
  options: [
    { value: 'apple', label: 'Apple', icon: 'https://nolus.io/currencies/osmosis-osmo.svg' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
    { value: 'grape', label: 'Grape' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'watermelon', label: 'Watermelon' },
  ]
});

const emit = defineEmits<{
  (e: 'unmounted', Function): void;
}>()

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (option: Option) => {
  selectedOption.value = option;
  isOpen.value = false;
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (!event.target.closest(`#dropdown-${props.id}`)) {
    isOpen.value = false;
  }
};

// Listen for clicks outside the dropdown
window.addEventListener('click', handleClickOutside);

// Cleanup event listener on component unmount
const cleanup = () => {
  window.removeEventListener('click', handleClickOutside);
};

// Emit cleanup function on component unmount
// This ensures we clean up the event listener when the component is removed from the DOM
// This is important to prevent memory leaks
emit('unmounted', cleanup);

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
