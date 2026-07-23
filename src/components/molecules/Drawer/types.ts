import type { ReactNode } from "react";
import type { DrawerProps as HeroDrawerProps } from "@heroui/drawer";

export interface DrawerClassNames {
  base?: string;
  backdrop?: string;
  header?: string;
  body?: string;
  footer?: string;
  closeButton?: string;
}

export interface DrawerProps
  extends Omit<
    HeroDrawerProps,
    "placement" | "size" | "children" | "classNames"
  > {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Cabecera libre. Tiene prioridad sobre `title`. */
  header?: ReactNode;
  footer?: ReactNode;
  placement?: "left" | "right" | "top" | "bottom";
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full";
  /** Ancho fijo del panel (ej. "450px"). Tiene prioridad sobre `size`. */
  customWidth?: string;
  hideCloseButton?: boolean;
  isDismissable?: boolean;
  className?: string;
  classNames?: DrawerClassNames;
  isAdmin?: boolean;
}
