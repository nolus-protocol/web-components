import type { Size, Type } from "@/shared/utils/types";

export type ButtonSize = keyof typeof Size;
export type ButtonType = keyof typeof Type;

export interface ButtonProps {
  label?: string;
  size?: ButtonSize;
  severity?: ButtonType;
  icon?: string;
  iconPosition?: "left" | "right";
  loading?: boolean;
  disabled?: boolean;
  class?: unknown;
  id?: string;
}
