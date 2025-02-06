import type { DropdownOption } from "@/components/atoms/dropdown/types";

export interface AdvancedCurrencyFieldBalance {
  value: string;
  ticker: string;
  customLabel?: string;
}

export interface AdvancedCurrencyFieldOption extends DropdownOption {
  price?: string;
  balance?: AdvancedCurrencyFieldBalance;
}

export interface AdvancedCurrencyFieldProps<T extends DropdownOption> {
  id: string;
  value?: string;
  valueOnly?: string;
  label?: string;
  labelAdvanced?: boolean;
  balanceLabel?: string;
  calculatedBalance?: string;
  hideBalance?: boolean;
  tooltip?: string;
  selectedCurrencyOption?: AdvancedCurrencyFieldOption;
  currencyOptions: AdvancedCurrencyFieldOption[];
  disabledCurrencyPicker?: boolean;
  disabledInputField?: boolean;
  name?: string;
  errorMsg?: string;
  isError?: boolean;
  numberValue?: string;
  onPaste?: (e: ClipboardEvent) => void;
  positive?: boolean;
  placeholder: string;
  pickerPlacehodler?: string;
  isLoadingPicker?: boolean;
  searchable?: boolean;
  itemsHeadline?: string[];
  itemTemplate?: (option?: T) => any;
}
