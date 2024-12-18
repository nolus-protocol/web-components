<template>
  <div class="flex items-center gap-4">
    <img
      :src="icon"
      alt=""
      class="h-8 w-8 object-contain"
    />
    <div class="flex flex-col">
      <div class="text-16 font-semibold">{{ amount }}</div>
      <div class="text-12 font-normal">{{ stableAmount }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IAsset } from "@/components/atoms/asset/types";

defineProps<IAsset>();
</script>
