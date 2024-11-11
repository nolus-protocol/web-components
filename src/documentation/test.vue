<template>
  <div>
    <div
      v-for="icon in iconList"
      :key="icon.path"
    >
      <div v-html="icon.icon"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";

const icons = import.meta.glob("../assets/icons/*.svg", { as: "raw" });

const iconList = ref<any[]>([]);

onMounted(async () => {
  const loadedIcons = [];
  for (const path in icons) {
    const icon = await icons[path]();
    loadedIcons.push({ path, icon });
  }
  iconList.value = loadedIcons;
});
</script>

<style lang="" scoped></style>
