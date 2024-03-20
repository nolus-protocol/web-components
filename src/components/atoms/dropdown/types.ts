export interface DropdownOption {
  value: string | number;
  label: string;
  icon?: string;
}

export interface DropdownProps {
  id?: string;
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  selected?: DropdownOption;
  error?: boolean;
  disabled?: boolean;
  onSelect: (option: DropdownOption) => void;
  isLoading?: boolean;
}
