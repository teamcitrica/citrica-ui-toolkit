import type { ReactNode, RefObject } from "react";
import type { IconName } from "../../atoms/Icon/Icon";

/** Una opción del menú de la cuenta (Mi perfil, Cerrar sesión…). */
export interface AdminMenuAction {
  key: string;
  label: ReactNode;
  icon?: IconName;
  /** En rojo, para acciones como "Cerrar sesión". */
  danger?: boolean;
  onAction: () => void;
}

/** Cuenta de quien ha entrado: avatar y menú a la derecha de la barra superior. */
export interface AdminUser {
  name: string;
  /** Rol; se muestra en el menú, con la inicial en mayúscula. */
  role?: string;
  /** Foto. Si no hay, el avatar muestra las iniciales. */
  avatarUrl?: string;
  /** Opciones del menú. Sin opciones, el avatar no abre nada. */
  menu?: AdminMenuAction[];
  /** Muestra el nombre junto al avatar (desde tablet). Default: true. */
  showName?: boolean;
}

export interface AdminNotificationItem {
  id: string;
  title: ReactNode;
  /** Texto secundario (ej. "Ver en CRM → Leads" o el mensaje del aviso). */
  detail?: ReactNode;
  /** Momento ya formateado (ej. "Hace 5 min"). */
  time?: ReactNode;
  /**
   * Leído o no. Si se usa, los no leídos llevan un punto y el contador cuenta
   * solo esos; si no se usa, el contador cuenta todos los avisos.
   */
  isRead?: boolean;
  icon?: IconName;
}

/** Avisos agrupados por tipo, con un título y un ícono por grupo (como en citrica-web). */
export interface AdminNotificationGroup {
  key: string;
  title: ReactNode;
  icon?: IconName;
  items: AdminNotificationItem[];
}

/**
 * Campanita de avisos. Los datos son del proyecto (de dónde salen, quién los
 * ve, cómo se agrupan); el layout solo los muestra. Usa `groups` para avisos
 * agrupados o `items` para una lista simple.
 */
export interface AdminNotifications {
  groups?: AdminNotificationGroup[];
  items?: AdminNotificationItem[];
  /** Número del globo. Default: los no leídos, o todos si no se usa `isRead`. */
  count?: number;
  onItemClick?: (item: AdminNotificationItem) => void;
  /** Muestra "Marcar como leídas" cuando hay no leídos. */
  onMarkAllRead?: () => void;
  title?: string;
  emptyText?: string;
  markAllReadLabel?: string;
}

export interface AdminNavbarProps {
  /** "admin": tokens `--color-admin-*`. "dashboard": tokens web `--color-*` (ej. área del alumno). Default: admin. */
  variant?: "admin" | "dashboard";
  /** Menú de la cuenta. Sin esta prop no se muestra. */
  user?: AdminUser;
  /** Campanita de avisos. Sin esta prop no se muestra. */
  notifications?: AdminNotifications;
  /** Controles propios a la derecha, antes de la campanita (ej. selector de idioma). */
  actions?: ReactNode;
  /** Contenido a la izquierda (ej. título de la sección). */
  start?: ReactNode;
  /**
   * Muestra el botón ☰ en celular y lo conecta con el Sidebar: pásale una
   * función que abra el menú (ver `mobileOpen` del Sidebar).
   */
  onMenuClick?: () => void;
  /** Estado del menú móvil, para que el ☰ lo anuncie a lectores de pantalla. */
  menuOpen?: boolean;
  /** Referencia al ☰, para que el Sidebar le devuelva el foco al cerrarse. */
  menuButtonRef?: RefObject<HTMLButtonElement>;
  /** Logo compacto junto al ☰ en celular (en escritorio el logo está en el sidebar). */
  mobileLogo?: ReactNode;
  /** Fija la barra arriba al hacer scroll en celular, para tener el ☰ a mano. Default: true. */
  stickyOnMobile?: boolean;
  className?: string;
}
