import { Size, Type } from "@/shared/utils/types";

export type ButtonSize = keyof typeof Size;
export type ButtonType = keyof typeof Type;

export interface ButtonProps {
  label?: string;
  size?: ButtonSize;
  severity?: ButtonType;
  outlined?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
  loading?: boolean;
  disabled?: boolean;
  class?: string | string[] | any;
  id?: any;
  key?: any;
}
