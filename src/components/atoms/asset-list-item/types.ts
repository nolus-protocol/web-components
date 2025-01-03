import type { Component } from "vue";

export interface AssetItemProps {
  icon?: string;
  abbreviation: string;
  name: string;
  balance: string;
  max_decimals?: number;
  price: string;
  disabled?: true;
  info?: Component;
}
