import type { Component, DefineComponent } from "vue";
import type { ButtonProps } from "@/components/atoms/button/types";

export interface LeaseTabProps {
  button: ButtonProps;
  content?: Component | DefineComponent | string;
  active?: boolean;
}

export enum LeaseStatus {
  OPENING = "OPENING",
  OPENED = "OPENED",
  PAID = "PAID"
}

export interface LeaseCurrencyProps {
  title: string;
  value?: string;
  tooltip?: string;
  class?: string;
}

export interface LeasePnlProps {
  click?: () => void;
  value?: string;
  status?: LeasePnlStatus;
}

export enum LeasePnlStatus {
  POSITIVE = "POSITIVE",
  NEGATIVE = "NEGATIVE",
  NEUTRAL = "NEUTRAL"
}

export enum LeaseOpeningBarStatuses {
  READY = "ready",
  CURRENT = "current"
}

export type LeaseProgressBarProps = { title: string; value: string[] | LeaseOpeningBarStatuses[] };

export interface LeaseProps {
  title: { value: string; class?: string };
  history: {
    click?: () => void;
    value: string;
  };
  share?: ButtonProps;
  tabs: LeaseTabProps[];
  status: LeaseStatus;
  pnl?: LeasePnlProps;
  progressBar?: LeaseProgressBarProps;
  progressDate: {
    value: string;
    title: string;
  };
  debt?: LeaseCurrencyProps;
  interest?: LeaseCurrencyProps;
  interestDue?: LeaseCurrencyProps;
  actionButtons: {
    repay?: ButtonProps;
    close?: ButtonProps;
    collect?: ButtonProps;
  };
}

export type LeaseEmits = {
  (e: "on-share", data: LeaseProps): void;
  (e: "on-collect", data: LeaseProps): void;
  (e: "on-repay", data: LeaseProps): void;
  (e: "on-close", data: LeaseProps): void;
};
