import type { Variant } from "@/shared/utils/types";

export type LabelVariant = keyof typeof Variant;

export interface LabelProps {
  value?: string;
  variant: LabelVariant;
  id?: any;
}
