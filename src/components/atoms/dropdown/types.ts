import type { Component, VNode } from "vue";
import type { Size } from "@/shared/utils/types";

/** What an item template returns; the dropdown renders it through `<component :is>`. */
export type DropdownItemRender = VNode | Component | undefined;

export type DropdownOption = {
  value: string | number;
  label: string;
  icon?: string;
  // Consumers attach and read their own fields on options (balances, decimals, prices); typing options generically
  // instead is a breaking API change for the webapp.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
