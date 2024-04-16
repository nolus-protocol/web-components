<template>
  <button
    class="button button-secondary flex gap-3 rounded-lg px-6 py-4 text-14 font-medium"
    type="button"
    @click="onClick"
  >
    <span
      v-if="icon"
      :class="[icon]"
      class="icon text-[32px]"
    />
    {{ label }}
  </button>
</template>

<script lang="ts" setup>
import type { WalletProps } from "./types";

defineProps<WalletProps>();

const emit = defineEmits<{
  (e: "click", id: number): void;
}>();

const onClick = () => {
  emit("click", 1);
};
</script>
