export type SvgProps = {
  size?: "xs" | "s" | "m" | "l" | "xl" | "2xl";
  name: IconNames | string;
  defaultColor?: boolean;
};

export type IconNames = (typeof iconNames)[number];

export const iconNames = ["approval", "arrow-down-right", "arrow-down", "arrow-external", "arrow-from", "arrow-left", "arrow-right", "arrow-to", "arrow-up", "arrow-wall-down", "arrow", "assets", "bar-chart", "bell-disabled", "bell", "check-solid", "check", "checked", "chevron-big-down", "chevron-right-small", "chevron-small-down", "chevron-small-right", "circle-x", "close", "cogwheel", "copy", "cursor-on-list", "dashboard", "earn", "edit-columns", "emoji-smile", "error-triangle", "eye-open", "eye-slash", "filter", "hamburger-menu", "heart", "help", "history", "home", "hourglass", "info", "information-circle", "information-triangle", "leases", "lifesaver", "line-chart", "list-sparkle", "minus", "money-hand", "more", "news", "plus", "refresh", "search", "share", "slider-handle", "slider", "stake", "star", "strategy", "swap", "table-options", "thumb-down", "thumb-up", "transfer", "trash", "trend-down", "trend-up", "vote", "wallet-add", "wallet", "warning", "watcher"] as const;

