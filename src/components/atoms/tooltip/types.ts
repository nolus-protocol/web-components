import type { MotionValue } from "motion-v";

export interface TooltipProps {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  rotateValue?: MotionValue<number>;
  forceVisible?: boolean;
}
