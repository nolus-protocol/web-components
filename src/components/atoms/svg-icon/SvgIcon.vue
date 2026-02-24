<template>
  <IconComponent
    :class="[{ 'fill-icon-default text-icon-default': defaultColor }]"
    v-bind="svgAttributes"
    viewBox="0 0 24 24"
  />
</template>

<script lang="ts" setup>
import type { Component } from "vue";
import { computed, defineAsyncComponent } from "vue";
import { type SvgProps } from "./types";

const props = withDefaults(defineProps<SvgProps>(), {
  size: "m",
  defaultColor: true
});

const { loader } = createIconMap().get(props.name) ?? {};
const IconComponent = loader ? defineAsyncComponent(loader) : null;

const svgAttributes = computed(() => {
  switch (props.size) {
    case "xs":
      return { width: "16", height: "16" };
    case "s":
      return { width: "18", height: "18" };
    case "l":
      return { width: "24", height: "24" };
    case "xl":
      return { width: "32", height: "32" };
    case "2xl":
      return { width: "40", height: "40" };
    default:
      return { width: "20", height: "20" };
  }
});

function getIconNameFromPath(path: string) {
  const pathSplit = path.split("/");
  const filename = pathSplit[pathSplit.length - 1] || "";

  return filename.replace(".svg", "");
}

function createIconMap() {
  const importGlob = import.meta.glob("@/assets/icons/*.svg");
  const iconMap = new Map<string, { loader: () => Promise<Component> }>([]);

  for (const path in importGlob) {
    const iconName = getIconNameFromPath(path);
    iconMap.set(iconName, { loader: importGlob[path] as () => Promise<Component> });
  }

  return iconMap;
}
</script>

<style lang="" scoped></style>
