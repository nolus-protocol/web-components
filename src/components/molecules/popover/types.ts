import type { ComponentPublicInstance } from "vue";

export interface PopoverProps {
  title?: string;
  showClose?: boolean;
  parent: HTMLElement | ComponentPublicInstance | null | undefined;
  position: "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  top?: number;
  fullscreenOnMobile?: boolean;
}
