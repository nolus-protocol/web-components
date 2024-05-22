import type { ButtonProps } from "../../atoms/button/types";

export interface HistoryTableItem {
  value: string;
  url?: string;
  bold?: boolean;
  class?: string;
}

export interface HistoryTableRowItemProps {
  classes?: string;
  items: HistoryTableItem[];
}

export interface AssetsTableRowItem {
  type?: CURRENCY_VIEW_TYPES;
  value?: string;
  subValue?: string;
  image?: string;
  imageClass?: string;
  button?: boolean;
  class?: string;
}

export interface AssetsTableRowItemProps {
  items: AssetsTableRowItem[];
  rowButton?: ButtonProps | null | undefined;
}

export interface EarningAssetsTableRowItem {
  type?: CURRENCY_VIEW_TYPES;
  value?: string;
  valueInfo?: string;
  subValue?: string;
  image?: string;
  imageClass?: string;
  button?: ButtonProps;
  buttonOnly?: boolean;
  class?: string;
}

export interface EarningAssetsTableRowItemProps {
  items: EarningAssetsTableRowItem[];
  rowButton?: ButtonProps | null | undefined;
}

export enum CURRENCY_VIEW_TYPES {
  TOKEN = "TOKEN",
  CURRENCY = "CURRENCY",
  COMPLEX = "COMPLEX"
}
