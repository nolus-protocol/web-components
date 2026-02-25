import { Type } from "@/shared/utils/types";

export interface SpinnerProps {
  width?: string;
  height?: string;
  severity?: keyof typeof Type;
}
