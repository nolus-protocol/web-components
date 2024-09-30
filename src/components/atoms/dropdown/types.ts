import type { Size } from "@/shared/utils/types";

export interface DropdownOption {
  value: string | number;
  label: string;
  icon?: string;
}

export interface DropdownProps {
  id?: string;
  size?: Size.small | Size.medium;
  dropdownLabel?: string;
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  selected?: DropdownOption;
  error?: boolean;
  disabled?: boolean;
  onSelect: (option: DropdownOption) => void;
  isLoading?: boolean;
}
