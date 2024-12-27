import type { Component } from "vue";

export interface AssetItemProps {
  icon?: string;
  abbreviation: string;
  name: string;
  balance: string;
  price: string;
  disabled?: true;
  info?: Component;
}
