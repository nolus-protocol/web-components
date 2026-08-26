export interface RangeProps {
  labelLeft?: string;
  labelRight?: string;
  labelMid?: string;
  positions?: number;
  minPosition: number;
  midPosition?: number;
  maxPosition: number;
  disabled?: boolean;
  value?: number;
  tooltipContent?: string;
  markers?: number[];
  onClickRightLabel?: Function;
  onClickLeftLabel?: Function;
  onClickMidLabel?: Function;
}
