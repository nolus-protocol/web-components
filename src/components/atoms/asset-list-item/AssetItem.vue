<template>
  <li class="flex min-h-10 cursor-pointer items-center px-4 py-2">
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
      <span class="text-16 font-semibold">{{ balance }}</span>
      <span class="text-12 font-normal">{{ price }}</span>
    </div>
  </li>
</template>

<script lang="ts" setup>
import type { AssetItemProps } from "./types";

const props = withDefaults(defineProps<AssetItemProps>(), {});
</script>

<style lang="scss" scoped></style>
