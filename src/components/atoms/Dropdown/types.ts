import type { ReactNode } from "react";
import type { DropdownProps as HeroDropdownProps } from "@heroui/dropdown";
import type { IconName } from "../Icon/Icon";

export type DropdownItemColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

export interface DropdownItemData {
  key: string;
  label: ReactNode;
  /** Ícono lucide al inicio (vía componente Icon). */
  startIcon?: IconName;
  /** Ícono lucide al final. */
  endIcon?: IconName;
  /** Nodo libre al inicio (alternativa a startIcon). */
  startContent?: ReactNode;
  /** Nodo libre al final. */
  endContent?: ReactNode;
  /** Tamaño en px de los íconos start/end. */
  iconSize?: number;
  color?: DropdownItemColor;
  className?: string;
  description?: ReactNode;
  showDivider?: boolean;
  isDisabled?: boolean;
}

export interface DropdownProps
  extends Omit<HeroDropdownProps, "children" | "classNames" | "trigger"> {
  /** Elemento que abre el menú (normalmente un Button). */
  trigger: ReactNode;
  items: DropdownItemData[];
  /** Se llama con el `key` del item elegido. */
  onAction?: (key: string) => void;
  isAdmin?: boolean;
  ariaLabel?: string;
  disabledKeys?: string[];
  className?: string;
  /** classNames del popover del Dropdown (base, content…). */
  classNames?: HeroDropdownProps["classNames"];
  /** classNames del menú (base, list, emptyContent…). */
  menuClassNames?: Record<string, string>;
}
