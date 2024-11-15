export interface PopoverProps {
  title: string;
  showClose?: boolean;
  position: "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  top?: number;
}
