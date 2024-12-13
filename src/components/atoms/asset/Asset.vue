<template>
  <div class="flex items-center gap-4">
    <img
      alt="Cosmos"
      class="h-8 w-8 object-contain"
      :src="icon"
    />
    <div class="flex flex-col">
      <div class="flex !justify-start justify-end">{{ amount }}</div>
      <div class="flex flex-1 text-12 font-normal">{{ stableAmount }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IAsset } from "@/components/atoms/asset/types";

defineProps<IAsset>();
</script>
