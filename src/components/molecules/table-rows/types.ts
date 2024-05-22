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
  id: number;
  items: AssetsTableRowItem[];
  rowButton?: ButtonProps;
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
  id: any;
  items: EarningAssetsTableRowItem[];
  rowButton?: ButtonProps;
}

export enum CURRENCY_VIEW_TYPES {
  TOKEN = "TOKEN",
  CURRENCY = "CURRENCY",
  COMPLEX = "COMPLEX"
}
