export enum NotificationBoxType {
  warning = "warning",
  error = "error"
}

export interface INotificationBox {
  type: NotificationBoxType;
}
