import type { VNode } from "vue";

type Step = {
  label: string;
  approval?: boolean;
  icon: string;
};

export type MediumStep = {
  token?: {
    symbol: string;
    balance: string;
  };
  tokenComponent?: () => VNode;
  meta?: () => VNode;
} & Step;

export enum StepperVariant {
  SMALL = "small",
  MEDIUM = "medium"
}

export interface BaseStepperProps {
  steps: Step[];
  activeStep: number;
  handleStep?: (step: number) => void;
}

export interface SmallStepperProps extends BaseStepperProps {}

export interface MediumStepperProps extends BaseStepperProps {
  steps: MediumStep[];
}

export type StepperMap = {
  [StepperVariant.SMALL]: SmallStepperProps;
  [StepperVariant.MEDIUM]: MediumStepperProps;
};
