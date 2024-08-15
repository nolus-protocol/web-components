import type { Variant } from "@/shared/utils/types";

export type LabelVariant = keyof typeof Variant;

export interface LabelProps {
  label?: string;
  variant?: LabelVariant;
  icon?: string;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  class?: string | string[] | any;
  id?: any;
}
