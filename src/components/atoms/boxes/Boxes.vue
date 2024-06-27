<template>
  <button
    class="button button-secondary flex justify-start gap-3 rounded-lg px-4 py-3 text-14 font-medium"
    type="button"
    @click="onClick"
  >
    <span
      v-if="icon"
      :class="[icon]"
      class="icon !text-[35px]"
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
