<template>
  <div
    :id="`input-wrapper-${id}`"
    class="field-wrapper"
  >
    <label
      v-if="label"
      :for="`input-${id}`"
      class="field-label"
      >{{ label }}</label
    >
    <div
      v-if="type === InputType.search"
      class="relative"
    >
      <SearchIcon
        id="search-close"
        :class="[
          {
            'left-2': size === Size.small,
            'left-3': size === Size.medium
          }
        ]"
        class="text-icon-default absolute top-[50%] translate-y-[-50%]"
      />
      <input
        :id="`input-${id}`"
        v-model="inputValue"
        :class="['field-input', 'w-full', 'px-[31px] pr-[25px] focus:px-[30px] focus:pr-[24px]', classes]"
        :disabled="disabled"
        :type="type"
        @input="(e) => $emit('input', e)"
      />
      <i
        v-if="inputValue?.length > 0"
        class="icon icon-close bg-icon-default dark:text- text-neutral-bg-2 absolute right-2 top-[50%] flex h-[18px] w-[18px] translate-y-[-50%] cursor-pointer items-center justify-center rounded-full"
        @click="inputValue = ''"
      />
    </div>
    <input
      v-else
      :id="`input-${id}`"
      v-model="inputValue"
      :class="['field-input', classes]"
      :disabled="disabled"
      :type="type"
      @input="(e) => $emit('input', e)"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import SearchIcon from "@/assets/icons/search.svg";
import { Size } from "@/shared/utils/types";
import type { InputProps } from "./types";
import { InputType } from "./types";

// Create a ref for the input element
const inputValue = ref("");

const props = withDefaults(defineProps<InputProps>(), {
  size: Size.medium
});

const classes = computed(() => ({
  "px-2 py-1 focus:px-[7px] focus:py-[3px]": props.size === Size.small,
  "px-3 py-2 focus:px-[11px] focus:py-[7px]": props.size === Size.medium,

  "!border-border-success": props.valid,
  "!border-danger-100": props.error,

  password: props.type === InputType.password
}));
</script>

<style lang="scss" scoped>
.field-wrapper {
  .icon-close:before {
    font-size: 10px;
  }
}
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

#search-close {
  path {
    @apply fill-neutral-bg-2;
    stroke: white;
    fill: white;
  }
}
</style>
