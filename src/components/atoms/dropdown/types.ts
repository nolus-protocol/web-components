import type { Size } from "@/shared/utils/types";

export type DropdownOption = {
  value: string | number;
  label: string;
  icon?: string;
  [key: string]: any;
};

export interface DropdownProps {
  id?: string;
  size?: Size.small | Size.medium;
  dropdownLabel?: string;
  dropdownClassName?: string;
  searchable?: boolean;
  label?: string;
  hideText?: boolean;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  position?: "left" | "right";
}
