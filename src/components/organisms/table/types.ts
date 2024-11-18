import { type ToggleProps } from "@/components/atoms/toggle/types";
import { type InputProps } from "@/components/atoms/input/types";
import type { Tooltip } from "@/components/atoms/tooltip/types";
import type { ButtonProps } from "@/components/atoms/button/types";

export interface TableProps {
  searchable?: boolean;
  inputSearch?: InputProps;
  size?: string;
  toggle?: ToggleProps;
  filterable?: boolean;
  filters?: {};
  columns?: TableColumnProps[];
  columnsClasses?: string;
  footerClasses?: string;
}

export interface TableColumnProps {
  label: string;
  class?: string;
  tooltip?: Tooltip;
  sortable?: boolean;
  variant?: "right" | "center" | "left";
}

export interface TableRowItem {
  type?: CURRENCY_VIEW_TYPES;
  variant?: "right" | "center" | "left";
  value?: string;
  component?: () => any;
  subValue?: string;
  image?: string;
  imageClass?: string;
  button?: boolean;
  class?: string;
  url?: string;
}

export interface TableRowItemProps {
  items: TableRowItem[];
  rowButton?: ButtonProps | null | undefined;
}

export enum CURRENCY_VIEW_TYPES {
  TOKEN = "TOKEN",
  CURRENCY = "CURRENCY",
  COMPLEX = "COMPLEX"
}
