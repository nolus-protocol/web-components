import { iconNames } from "./icon-names";

export { iconNames };

export type SvgProps = {
  size?: "xs" | "s" | "m" | "l" | "xl" | "2xl";
  name: IconNames | string;
  defaultColor?: boolean;
};

export type IconNames = (typeof iconNames)[number];
