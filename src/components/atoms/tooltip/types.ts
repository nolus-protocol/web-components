export interface TooltipProps {
  /** Rendered as HTML. Pass static markup or text sanitized by the caller, never raw user or chain input. */
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  /** Degrees the tooltip leans around the point 10px beyond the edge facing its target; changes ease in through CSS. */
  tilt?: number;
  forceVisible?: boolean;
}
