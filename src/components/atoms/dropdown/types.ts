import type { Size } from "@/shared/utils/types";

export type DropdownOption = {
  value: string | number;
  label: string;
  icon?: string;
};

export interface DropdownProps {
  id?: string;
  size?: Size.small | Size.medium;
  dropdownLabel?: string;
  searchable?: boolean;
  label?: string;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}
