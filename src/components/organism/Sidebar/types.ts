import type { ReactNode, RefObject } from "react";

export interface SubMenuItem {
  title: string;
  href: string;
}

export interface MenuItem {
  title: string;
  href?: string;
  icon?: string;
  subItems?: SubMenuItem[];
}

export interface SidebarUser {
  name?: string;
  role?: string;
  detail?: ReactNode; /** Dato extra bajo el rol (ej. el correo).*/
  avatarUrl?: string;
}

export interface SidebarProps {
  items: MenuItem[];
  activeHref?: string;
  activeSubHref?: string;
  exactMatch?: boolean;
  onItemClick?: (href: string) => void;
  className?: string;
  /** Contenido opcional en la cabecera del panel (ej. logo). */
  header?: ReactNode;
  collapsedHeader?: ReactNode;
  organization?: ReactNode;
  organizationShort?: string;
  user?: SidebarUser;
  collapsible?: boolean;
  storageKey?: string | false;
  onCollapsedChange?: (collapsed: boolean) => void;
  ariaLabel?: string;
  /**
   * Control externo del drawer móvil (lo usa el layout del proyecto con AdminNavbar, que pone el botón ☰
   * en su barra superior). Si se pasa, el Sidebar no dibuja su botón flotante.
   */
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
  /** Elemento que recibe el foco al cerrar el drawer controlado desde afuera (el ☰ externo). */
  mobileReturnFocusRef?: RefObject<HTMLElement | null>;
}
