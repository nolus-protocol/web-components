import type { ComponentPublicInstance } from "vue";

export interface PopoverProps {
  title?: string;
  showClose?: boolean;
  /** Accessible name of the close button; defaults to "Close", so pass the translated text. */
  closeLabel?: string;
  parent: HTMLElement | ComponentPublicInstance | null | undefined;
  position: "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  top?: number;
  fullscreenOnMobile?: boolean;
}
