export interface DialogProps {
  title: string;
  tabs?: { label: string; disabled?: boolean }[];
  activeTabIndex?: number;
  showClose?: boolean;
  disableClose?: boolean;
  classList?: string;
}
