import type { Component, DefineComponent } from "vue";
import type { ButtonProps } from "@/components/atoms/button/types";

export interface LeaseTabProps {
  button: ButtonProps;
  content: string | Component | DefineComponent;
}

export enum LeaseStatus {
  OPENING = "OPENING",
  OPENED = "OPENED",
  COLLECT = "COLLECT"
}

export interface LeaseCurrencyProps {
  title: string;
  value: string;
  tooltip?: string;
  class?: string;
}

export enum LeasePnlStatus {
  POSITIVE = "POSITIVE",
  NEGATIVE = "NEGATIVE",
  NEUTRAL = "NEUTRAL"
}

export interface LeaseProps {
  title: string;
  share?: ButtonProps;
  tabs: LeaseTabProps[];
  status: LeaseStatus;
  pnl: {
    value: string;
    status: LeasePnlStatus;
  };
  margin?: number;
  progressBarTitle: string;
  progressDateTitle: string;
  progressDate: string;
  debt?: LeaseCurrencyProps;
  interest?: LeaseCurrencyProps;
  interestDue?: LeaseCurrencyProps;
  actionButtons: {
    repay: ButtonProps;
    close: ButtonProps;
    collect: ButtonProps;
  };
}

export type LeaseEmits = {
  (e: "on-share", data: LeaseProps): void;
  (e: "on-collect", data: LeaseProps): void;
  (e: "on-repay", data: LeaseProps): void;
  (e: "on-close", data: LeaseProps): void;
};
