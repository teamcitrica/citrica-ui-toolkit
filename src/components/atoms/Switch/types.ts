import type { ReactNode, CSSProperties } from "react";

export interface SwitchClassNames {
  base?: string;
  wrapper?: string;
  hiddenInput?: string;
  thumb?: string;
  startContent?: string;
  endContent?: string;
  thumbIcon?: string;
  label?: string;
}

export interface SwitchProps {
  /** Familia de color del track cuando está encendido. Se resuelve por token (danger → error). */
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  isAdmin?: boolean;
  /** Estado controlado (on/off). */
  isSelected?: boolean;
  /** Estado inicial (no controlado). */
  defaultSelected?: boolean;
  onValueChange?: (isSelected: boolean) => void;
  size?: "sm" | "md" | "lg";
  isDisabled?: boolean;
  isReadOnly?: boolean;
  /** Label a la derecha del track. */
  children?: ReactNode;
  startContent?: ReactNode;
  endContent?: ReactNode;
  /** Ícono dentro del "pulgar". */
  thumbIcon?: ReactNode;
  name?: string;
  value?: string;
  className?: string;
  classNames?: SwitchClassNames;
  style?: CSSProperties;
}
