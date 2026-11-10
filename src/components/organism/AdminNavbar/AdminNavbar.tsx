"use client";
import React from "react";
import Icon from "../../atoms/Icon/Icon";
import { UserBox } from "./UserBox";
import { NotificationBell } from "./NotificationBell";
import type { AdminNavbarProps } from "./types";

// Barra superior del panel: ☰ en celular, acciones propias, campanita y menú de
// la cuenta. Va arriba del contenido, al lado del Sidebar, en el layout de cada
// proyecto. Cada pieza se activa con su prop: sin `user` no hay menú de cuenta,
// sin `notifications` no hay campanita, sin `onMenuClick` no hay ☰.

export function AdminNavbar({
  variant = "admin",
  user,
  notifications,
  actions,
  start,
  onMenuClick,
  menuOpen,
  menuButtonRef,
  mobileLogo,
  stickyOnMobile = true,
  className = "",
}: AdminNavbarProps) {
  const isAdmin = variant === "admin";
  const p = isAdmin ? "admin-" : "";
  // Colores por token, con los de Cítrica de respaldo.
  const vars = {
    "--al-page-bg": `var(--color-${p}surface, #ECF0F9)`,
    "--al-panel-bg": `var(--color-${p}surface-container-lowest, #FFFFFF)`,
    "--al-control-bg": `var(--color-${p}surface-container-low, #F0F3FA)`,
    "--al-control-border": `var(--color-${p}surface-dim, #D5DDEB)`,
    "--al-control-hover": `var(--color-${p}surface-container, #E3E9F4)`,
    "--al-fg": `var(--color-${p}primary, #265197)`,
    "--al-strong": `var(--color-${p}on-primary-container, #16305A)`,
    "--al-muted": `var(--color-${p}outline-variant, #8192AB)`,
    "--al-danger": `var(--color-${p}error, #EF4444)`,
  } as React.CSSProperties;

  // En escritorio la barra solo ocupa lugar si tiene algo; el ☰ y el logo
  // corto son solo de celular.
  const hasDesktopContent = Boolean(start || actions || notifications || user);

  return (
    <header
      className={`admin-navbar-citrica-ui ${isAdmin ? "admin-navbar-citrica-ui-admin" : ""} flex w-full items-center gap-2 px-4 py-3 md:px-6 ${
        stickyOnMobile ? "max-md:sticky max-md:top-0 max-md:z-30 max-md:bg-[color:var(--al-page-bg)]" : ""
      } ${hasDesktopContent ? "" : "md:hidden"} ${className}`}
      style={vars}
    >
      {onMenuClick && (
        <button
          ref={menuButtonRef}
          aria-expanded={menuOpen}
          aria-label="Abrir navegación"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--al-control-border)] bg-[color:var(--al-control-bg)] outline-none transition-colors hover:bg-[color:var(--al-control-hover)] focus-visible:ring-2 focus-visible:ring-[color:var(--al-fg)] focus-visible:ring-offset-2 motion-reduce:transition-none md:hidden"
          type="button"
          onClick={onMenuClick}
        >
          <Icon aria-hidden className="text-[color:var(--al-fg)]" name="Menu" size={20} />
        </button>
      )}
      {mobileLogo && <div className="flex shrink-0 items-center md:hidden">{mobileLogo}</div>}
      {start && <div className="min-w-0">{start}</div>}

      <div className="ml-auto flex items-center gap-2">
        {actions}
        {notifications && <NotificationBell isAdmin={isAdmin} notifications={notifications} panelVars={vars} />}
        {user && <UserBox isAdmin={isAdmin} user={user} />}
      </div>
    </header>
  );
}

export default AdminNavbar;
