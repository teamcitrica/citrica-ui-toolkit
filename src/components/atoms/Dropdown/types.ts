import type { ReactNode } from "react";
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

export type DropdownPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";

/** classNames del popover del Dropdown. */
export interface DropdownClassNames {
  base?: string;
  trigger?: string;
  backdrop?: string;
  content?: string;
  arrow?: string;
}

/** classNames del menú (lista de items). */
export interface DropdownMenuClassNames {
  base?: string;
  list?: string;
  emptyContent?: string;
}

export interface DropdownProps {
  /** Elemento que abre el menú (normalmente un Button). */
  trigger: ReactNode;
  items: DropdownItemData[];
  /** Se llama con el `key` del item elegido. */
  onAction?: (key: string) => void;
  isAdmin?: boolean;
  ariaLabel?: string;
  disabledKeys?: string[];
  placement?: DropdownPlacement;
  /** Separación entre el trigger y el menú (px). */
  offset?: number;
  backdrop?: "transparent" | "opaque" | "blur";
  /** Cierra el menú al elegir un item. Default: true. */
  closeOnSelect?: boolean;
  isDisabled?: boolean;
  /** Estado controlado del menú. */
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  shouldBlockScroll?: boolean;
  radius?: "none" | "sm" | "md" | "lg" | "full";
  shadow?: "none" | "sm" | "md" | "lg";
  className?: string;
  classNames?: DropdownClassNames;
  menuClassNames?: DropdownMenuClassNames;
}
