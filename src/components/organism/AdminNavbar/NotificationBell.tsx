"use client";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Text } from "../../atoms/Text";
import Icon from "../../atoms/Icon/Icon";
import type { AdminNotificationItem, AdminNotifications } from "./types";

// Campanita de la barra superior.

export function NotificationBell({
  notifications,
  isAdmin,
  panelVars,
}: {
  notifications: AdminNotifications;
  isAdmin: boolean;
  /** Variables de color para el panel, que se abre en un portal fuera del layout. */
  panelVars: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  const {
    groups,
    items,
    onItemClick,
    onMarkAllRead,
    title = "Notificaciones",
    emptyText = "Nada pendiente por ahora",
    markAllReadLabel = "Marcar como leídas",
  } = notifications;

  const sections = groups ?? (items ? [{ key: "__all", title: undefined, icon: undefined, items }] : []);
  const all = sections.reduce<AdminNotificationItem[]>((acc, g) => acc.concat(g.items), []);
  const usesReadState = all.some((i) => i.isRead !== undefined);
  const unread = all.filter((i) => i.isRead === false).length;
  const count = notifications.count ?? (usesReadState ? unread : all.length);
  const badge = count > 99 ? "99+" : String(count);

  const handleItem = (item: AdminNotificationItem) => {
    setOpen(false);
    onItemClick?.(item);
  };

  return (
    <Popover isOpen={open} placement="bottom-end" onOpenChange={setOpen}>
      <PopoverTrigger>
        <button
          aria-label={count > 0 ? `${title}: ${count} pendientes` : `${title}: nada pendiente`}
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--al-control-border)] bg-[color:var(--al-control-bg)] outline-none transition-colors hover:bg-[color:var(--al-control-hover)] focus-visible:ring-2 focus-visible:ring-[color:var(--al-fg)] focus-visible:ring-offset-2 motion-reduce:transition-none"
          type="button"
        >
          <Icon aria-hidden className="text-[color:var(--al-fg)]" name="Bell" size={20} />
          {count > 0 && (
            <span
              aria-hidden
              className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[color:var(--al-danger)] px-1 text-[11px] font-semibold leading-none text-white"
            >
              {badge}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <div className="flex w-[320px] max-w-[calc(100vw-32px)] flex-col" style={panelVars}>
          <div className="flex items-center justify-between gap-2 border-b border-[color:var(--al-control-border)] px-4 py-3">
            <Text color="var(--al-strong)" isAdmin={isAdmin} variant="label" weight="bold">
              {title}
            </Text>
            {onMarkAllRead && unread > 0 && (
              <button
                className="rounded-sm underline-offset-4 hover:underline"
                type="button"
                onClick={onMarkAllRead}
              >
                <Text color="var(--al-fg)" isAdmin={isAdmin} variant="label">
                  {markAllReadLabel}
                </Text>
              </button>
            )}
          </div>

          {all.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-8">
              <Icon aria-hidden className="text-[color:var(--al-muted)]" name="BellOff" size={20} />
              <Text color="var(--al-muted)" isAdmin={isAdmin} variant="label">
                {emptyText}
              </Text>
            </div>
          ) : (
            <div className="max-h-[420px] overflow-y-auto p-2">
              {sections
                .filter((g) => g.items.length > 0)
                .map((g) => (
                  <div key={g.key} className="mb-1 last:mb-0">
                    {g.title && (
                      <div className="flex items-center gap-1.5 px-2 pb-1 pt-2">
                        {g.icon && <Icon aria-hidden className="text-[color:var(--al-muted)]" name={g.icon} size={14} />}
                        <Text color="var(--al-muted)" isAdmin={isAdmin} variant="label" weight="bold" className="!uppercase">
                          {g.title}
                        </Text>
                      </div>
                    )}
                    {g.items.map((item) => (
                      <button
                        key={item.id}
                        className="flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-[color:var(--al-control-hover)] focus-visible:bg-[color:var(--al-control-hover)] motion-reduce:transition-none"
                        type="button"
                        onClick={() => handleItem(item)}
                      >
                        {item.icon && (
                          <Icon aria-hidden className="mt-0.5 shrink-0 text-[color:var(--al-fg)]" name={item.icon} size={16} />
                        )}
                        <span className="flex min-w-0 flex-1 flex-col">
                          <Text color="var(--al-strong)" isAdmin={isAdmin} variant="label" weight={item.isRead === false ? "bold" : "normal"}>
                            {item.title}
                          </Text>
                          {item.detail && (
                            <Text color="var(--al-muted)" isAdmin={isAdmin} variant="label">
                              {item.detail}
                            </Text>
                          )}
                          {item.time && (
                            <Text color="var(--al-muted)" isAdmin={isAdmin} variant="label" className="mt-0.5 !text-[11px]">
                              {item.time}
                            </Text>
                          )}
                        </span>
                        {item.isRead === false && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[color:var(--al-fg)]">
                            <span className="sr-only">No leído</span>
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationBell;
