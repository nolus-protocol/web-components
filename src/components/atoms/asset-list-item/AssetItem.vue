<template>
  <div>
    <li
      class="flex min-h-10 cursor-pointer items-center px-4 py-2"
      :class="{ disabled: disabled }"
    >
      <div class="flex flex-1 items-center">
        <img
          v-if="icon"
          :alt="name"
          :src="icon"
          class="mr-3 h-6 w-6"
        />
        <div class="flex flex-col">
          <span class="text-16 font-semibold">{{ abbreviation }}</span>
          <span class="text-12 font-normal">{{ name }}</span>
        </div>
      </div>
      <div class="flex flex-1 flex-col items-end">
        <span class="text-16 font-semibold">{{ max_decimals ? Number(balance).toFixed(max_decimals) : balance }}</span>
        <span class="text-12 font-normal">{{ price }}</span>
      </div>
    </li>
    <component :is="info" />
  </div>
</template>

<script lang="ts" setup>
import type { AssetItemProps } from "./types";

withDefaults(defineProps<AssetItemProps>(), {});
</script>

<style lang="scss" scoped>
li.disabled {
  opacity: 0.6;
  pointer-events: none;
}
</style>
