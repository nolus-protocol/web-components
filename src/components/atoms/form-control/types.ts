export enum FormControlVariant {
  vertical = "vertical",
  horizontal = "horizontal"
}

export interface FormControlProps {
  variant?: keyof typeof FormControlVariant;
  label: string;
  helperText?: boolean;
}
