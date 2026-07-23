import type { CSSProperties } from "react";
import type { SwitchProps as HeroSwitchProps } from "@heroui/switch";

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

export interface SwitchProps
  extends Omit<HeroSwitchProps, "color" | "classNames"> {
  /** Familia de color del track cuando está encendido. Se resuelve por token (danger → error). */
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  isAdmin?: boolean;
  className?: string;
  classNames?: SwitchClassNames;
  style?: CSSProperties;
}
