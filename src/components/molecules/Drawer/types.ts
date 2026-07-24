import type { ReactNode, CSSProperties } from "react";

export interface DrawerClassNames {
  base?: string;
  backdrop?: string;
  header?: string;
  body?: string;
  footer?: string;
  closeButton?: string;
}

export interface DrawerProps {
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
  /** Cerrar al hacer clic fuera. Default: true. */
  isDismissable?: boolean;
  /** Deshabilita cerrar con la tecla Esc. */
  isKeyboardDismissDisabled?: boolean;
  /** Fondo detrás del panel. */
  backdrop?: "transparent" | "opaque" | "blur";
  /** Comportamiento del scroll del contenido. */
  scrollBehavior?: "inside" | "outside";
  radius?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg";
  /** Bloquea el scroll del body mientras está abierto. */
  shouldBlockScroll?: boolean;
  disableAnimation?: boolean;
  /** Callback al abrir/cerrar (estado controlado alternativo a onClose). */
  onOpenChange?: (isOpen: boolean) => void;
  defaultOpen?: boolean;
  isAdmin?: boolean;
  className?: string;
  classNames?: DrawerClassNames;
  style?: CSSProperties;
}
