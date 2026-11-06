export interface DialogProps {
  title: string;
  tabs?: { label: string; disabled?: boolean }[];
  activeTabIndex?: number;
  showClose?: boolean;
  /** Accessible name of the close button; defaults to "Close", so pass the translated text. */
  closeLabel?: string;
  disableClose?: boolean;
  classList?: string;
  stickyFooter?: boolean;
}
