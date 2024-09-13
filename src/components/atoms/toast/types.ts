import type { ButtonProps } from "@/components/atoms/button/types";

export enum ToastType {
  info = "info",
  success = "success",
  error = "error"
}

export interface IToast {
  type: ToastType;
  undoBtnProps?: ButtonProps;
  onClose?: () => void;
  onUndo?: () => void;
}
