export enum AlertType {
  info = "info",
  success = "success",
  warning = "warning",
  error = "error"
}

export interface IAlert {
  type: AlertType;
  title?: string;
  showClose?: boolean;
  onClose?: () => void;
}
