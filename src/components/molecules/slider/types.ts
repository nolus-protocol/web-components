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
  /** Accessible name of the thumb; defaults to "Adjust value", so pass the translated text. */
  thumbLabel?: string;
  markers?: number[];
  onClickRightLabel?: () => void;
  onClickLeftLabel?: () => void;
  onClickMidLabel?: () => void;
}
