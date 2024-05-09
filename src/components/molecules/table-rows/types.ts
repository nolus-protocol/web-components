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
  value: string;
  subValue?: string;
  image?: string;
  button?: boolean;
  class?: string;
}

export interface AssetsTableRowItemProps {
  id: number;
  items: AssetsTableRowItem[];
}

export interface EarningAssetsTableRowItem {
  value: string;
  valueInfo?: string;
  subValue?: string;
  image?: string;
  button?: ButtonProps;
  class?: string;
}

export interface EarningAssetsTableRowItemProps {
  id: number;
  items: EarningAssetsTableRowItem[];
}
