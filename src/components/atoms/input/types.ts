import type { Size } from "@/shared/utils/types";

export enum InputType {
  text = "text",
  password = "password",
  search = "search",
  email = "email"
}

export interface InputProps {
  id: string;
  size?: Size.small | Size.medium;
  label?: string;
  type: keyof typeof InputType;
  value?: string | number;
  error?: boolean;
  disabled?: boolean;
  valid?: boolean;
  onChange?: (event: Event) => void;
}
