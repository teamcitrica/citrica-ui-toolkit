import type { ReactNode } from "react";

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

export interface SidebarProps {
  items: MenuItem[];
  activeHref?: string;
  activeSubHref?: string;
  onItemClick?: (href: string) => void;
  className?: string;
  /** Contenido opcional en la cabecera del panel (ej. logo). */
  header?: ReactNode;
  /** Etiqueta accesible del nav. Por defecto "Navegación principal". */
  ariaLabel?: string;
}
