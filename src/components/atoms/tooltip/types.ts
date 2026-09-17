import type { MotionValue } from "motion-v";

export interface TooltipProps {
  /** Rendered as HTML. Pass static markup or text sanitized by the caller, never raw user or chain input. */
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  rotateValue?: MotionValue<number>;
  forceVisible?: boolean;
}
