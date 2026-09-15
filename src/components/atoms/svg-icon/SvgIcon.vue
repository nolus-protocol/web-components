<template>
  <component
    :is="IconComponent"
    v-if="IconComponent"
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

const icons = createIconMap();
const resolved = new Map<string, Component>();

// Resolved off the live `name`, not once at setup: a consumer that swaps the
// name on state (an eye that opens and shuts, a chevron that turns) gets the
// new glyph. Each name's async component is built once, so switching back
// reuses it instead of remounting a fresh loader.
function iconComponent(name: string): Component | null {
  const entry = icons.get(name);
  if (!entry) {
    return null;
  }
  let component = resolved.get(name);
  if (!component) {
    component = defineAsyncComponent(entry.loader);
    resolved.set(name, component);
  }
  return component;
}

const IconComponent = computed(() => iconComponent(props.name));

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
