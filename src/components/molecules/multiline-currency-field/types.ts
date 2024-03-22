import type { DropdownOption } from "@/components/types";

export interface CurrencyFieldBalance {
  label: string;
  value: string;
  ticker: string;
}

export interface CurrencyFieldOption extends DropdownOption {
  price?: string;
}

export interface CurrencyFieldProps {
  id: string;
  firstInputValue?: string;
  secondInputValue?: string;
  label?: string;
  balance?: CurrencyFieldBalance;
  firstCalculatedBalance?: string;
  secondCalculatedBalance?: string;
  tooltip?: string;
  selectedFirstCurrencyOption?: CurrencyFieldOption;
  selectedSecondCurrencyOption?: CurrencyFieldOption;
  currencyOptions: CurrencyFieldOption[];
  disabledCurrencyPicker?: boolean;
  disabledInputField?: boolean;
  name?: string;
  errorMsg?: string;
  isError?: boolean;
  onPaste?: (e: ClipboardEvent) => void;
  onSwap?: (e: Event) => void;
  positive?: boolean;
  placeholder: string;
  isLoadingPicker?: boolean;
}

interface OnSelectionChange {
  currency: CurrencyFieldOption | undefined;
  input: { value: string; order: number };
}

export interface CurrencyFieldEmits {
  (e: "on-first-change", data: OnSelectionChange): void;
  (e: "on-second-change", data: OnSelectionChange): void;
}
