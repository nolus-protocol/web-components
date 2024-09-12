export enum ToastType {
  info = "info",
  success = "success",
  warning = "warning",
  error = "error"
}

export interface IToast {
  type: ToastType;
  onClose?: () => void;
  onUndo?: () => void;
}
