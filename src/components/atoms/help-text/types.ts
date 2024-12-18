import type { Variant } from "@/shared/utils/types";

export type IHelpTextProps = {
  variant: Variant.info | Variant.success | Variant.error;
  content: string;
};
