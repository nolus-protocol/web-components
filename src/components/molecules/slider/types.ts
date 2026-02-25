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
  onClickRightLabel?: Function;
  onClickLeftLabel?: Function;
  onClickMidLabel?: Function;
}
