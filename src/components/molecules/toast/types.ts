import type { ButtonProps } from "@/components/atoms/button/types";
import type { IconNames } from "@/components/atoms/svg-icon/types";

export enum ToastType {
  info = "info",
  success = "success",
  error = "error"
}

export interface IToast {
  type: ToastType;
  undoBtnProps?: ButtonProps;
  /** Accessible name of the close button; defaults to "Close", so pass the translated text. */
  closeLabel?: string;
  icon?: IconNames;
  timeout?: number;
  onClose?: () => void;
  onUndo?: () => void;
}
