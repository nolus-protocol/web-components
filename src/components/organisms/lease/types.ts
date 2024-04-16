import type { Component, DefineComponent } from "vue";
import type { ButtonProps } from "@/components/atoms/button/types";

export interface LeaseTabProps {
  button: ButtonProps;
  content: Component | DefineComponent | string;
}

export enum LeaseStatus {
  OPENING = "OPENING",
  OPENED = "OPENED",
  COLLECT = "COLLECT"
}

export interface LeaseDebtProps {
  title: string;
  value: string;
  tooltip?: string;
}

export interface LeaseInterestProps {
  title: string;
  value: string;
  tooltip?: string;
  classes?: string;
}

export interface LeaseInterestDueProps {
  title: string;
  value: string;
  tooltip?: string;
  classes?: string;
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
  progressBarTitle: string;
  progressDateTitle: string;
  progressDate: string;
  debt?: LeaseDebtProps;
  interest?: LeaseInterestProps;
  interestDue?: LeaseInterestDueProps;
  actionButtons: {
    repay: ButtonProps;
    close: ButtonProps;
    collect: ButtonProps;
  };
}
