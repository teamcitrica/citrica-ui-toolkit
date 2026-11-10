"use client";
import React from "react";
import { Text } from "../../atoms/Text";
import Icon from "../../atoms/Icon/Icon";
import { Dropdown } from "../../atoms/Dropdown";
import type { AdminUser } from "./types";

// Menú de la cuenta de la barra superior: UserBox avatar + nombre en una píldora, y al abrirlo
// las opciones (Mi perfil, Cerrar sesión…). Interno de AdminNavbar.

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase();

const capitalize = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

export function UserBox({ user, isAdmin }: { user: AdminUser; isAdmin: boolean }) {
  const showName = user.showName !== false;
  const menu = user.menu ?? [];
  const role = capitalize(user.role);
  // El menú se abre en un portal, fuera del layout: sus colores van con los
  // tokens directos y no con las variables `--al-*` del layout.
  const menuStrong = isAdmin
    ? "var(--color-admin-on-primary-container, #16305A)"
    : "var(--color-on-surface, #1F1F1F)";
  const menuMuted = isAdmin
    ? "var(--color-admin-outline-variant, #8192AB)"
    : "var(--color-on-surface-var, #4A4A4A)";

  const avatar = (
    <span
      aria-hidden
      className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[color:var(--al-panel-bg)]"
    >
      {user.avatarUrl ? (
        <img alt="" className="h-full w-full object-cover" src={user.avatarUrl} />
      ) : (
        <Text color="var(--al-fg)" isAdmin={isAdmin} variant="label" weight="bold">
          {initials(user.name) || "?"}
        </Text>
      )}
    </span>
  );

  const pill = (interactive: boolean) => (
    <span
      className={`flex h-10 items-center gap-2 rounded-full border border-[color:var(--al-control-border)] bg-[color:var(--al-control-bg)] p-1 ${
        showName ? "sm:pr-3" : ""
      } ${interactive ? "transition-colors hover:bg-[color:var(--al-control-hover)] motion-reduce:transition-none" : ""}`}
    >
      {avatar}
      {showName && (
        <span className="hidden max-w-[160px] truncate sm:inline">
          <Text color="var(--al-strong)" isAdmin={isAdmin} variant="label" weight="bold">
            {user.name}
          </Text>
        </span>
      )}
      {interactive && (
        <Icon aria-hidden className="hidden text-[color:var(--al-fg)] sm:block" name="ChevronDown" size={16} />
      )}
    </span>
  );

  // Sin opciones: solo se muestra quién ha entrado.
  if (menu.length === 0) {
    return (
      <span aria-label={[user.name, role].filter(Boolean).join(" · ")} role="img" title={user.name}>
        {pill(false)}
      </span>
    );
  }

  return (
    <Dropdown
      ariaLabel={`Cuenta de ${user.name}`}
      isAdmin={isAdmin}
      items={[
        // Cabecera con el nombre y el rol: en celular el nombre no se ve en la píldora.
        {
          key: "__account",
          label: (
            <span className="flex flex-col">
              <Text color={menuStrong} isAdmin={isAdmin} variant="label" weight="bold">
                {user.name}
              </Text>
              {role && (
                <Text color={menuMuted} isAdmin={isAdmin} variant="label">
                  {role}
                </Text>
              )}
            </span>
          ),
          isDisabled: true,
          showDivider: true,
          className: "!opacity-100 cursor-default",
        },
        ...menu.map((a) => ({
          key: a.key,
          label: a.label,
          startIcon: a.icon,
          color: a.danger ? ("danger" as const) : undefined,
        })),
      ]}
      placement="bottom-end"
      trigger={
        <button
          aria-label={`Cuenta de ${user.name}`}
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--al-fg)] focus-visible:ring-offset-2"
          type="button"
        >
          {pill(true)}
        </button>
      }
      onAction={(key) => menu.find((a) => a.key === key)?.onAction()}
    />
  );
}

export default UserBox;
