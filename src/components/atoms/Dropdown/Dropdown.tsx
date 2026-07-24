"use client";
import React from "react";
import {
  Dropdown as HeroDropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import clsx from "clsx";
import Icon from "../Icon/Icon";
import { Text } from "../Text";
import type { DropdownProps } from "./types";

// Clases de tema por token. Se escriben como literales completos (admin vs web)
// para que Tailwind las genere; los tokens `--color-*` son globales (:root), así
// que resuelven aunque el menú se renderice en portal.
const THEME = {
  admin: {
    content: "bg-[var(--color-admin-surface-container-lowest)]",
    fg: "text-[var(--color-admin-on-surface)]",
    fgDanger: "text-[var(--color-admin-error)]",
    hover: "data-[hover=true]:bg-[var(--color-admin-surface-container)]",
  },
  web: {
    content: "bg-[var(--color-surface-container-lowest)]",
    fg: "text-[var(--color-on-surface)]",
    fgDanger: "text-[var(--color-error)]",
    hover: "data-[hover=true]:bg-[var(--color-surface-container)]",
  },
};

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  onAction,
  isAdmin = false,
  ariaLabel = "Menú de acciones",
  placement = "bottom-end",
  offset,
  backdrop,
  closeOnSelect,
  isDisabled,
  isOpen,
  defaultOpen,
  onOpenChange,
  shouldBlockScroll,
  radius,
  shadow,
  disabledKeys,
  className,
  classNames,
  menuClassNames,
}) => {
  const t = isAdmin ? THEME.admin : THEME.web;

  return (
    <HeroDropdown
      className={className}
      classNames={{
        ...classNames,
        // Fondo del menú según token (admin/web).
        content: clsx(t.content, classNames?.content),
      }}
      placement={placement}
      offset={offset}
      backdrop={backdrop}
      closeOnSelect={closeOnSelect}
      isDisabled={isDisabled}
      isOpen={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      shouldBlockScroll={shouldBlockScroll}
      radius={radius}
      shadow={shadow}
    >
      <DropdownTrigger>{trigger}</DropdownTrigger>

      <DropdownMenu
        aria-label={ariaLabel}
        onAction={(key) => onAction?.(String(key))}
        disabledKeys={disabledKeys}
        classNames={menuClassNames}
      >
        {items.map((item) => {
          const isDanger = item.color === "danger";

          const startContent = item.startIcon ? (
            <Icon name={item.startIcon} size={item.iconSize ?? 16} />
          ) : (
            item.startContent
          );
          const endContent = item.endIcon ? (
            <Icon name={item.endIcon} size={item.iconSize ?? 16} />
          ) : (
            item.endContent
          );

          // La etiqueta usa `Text` (tipografía admin/web) heredando el color del
          // item (currentColor), para que ícono y texto vayan del mismo color.
          const labelNode =
            typeof item.label === "string" || typeof item.label === "number" ? (
              <Text
                as="span"
                variant="label"
                color="currentColor"
                isAdmin={isAdmin}
              >
                {item.label}
              </Text>
            ) : (
              item.label
            );

          return (
            <DropdownItem
              key={item.key}
              // Color del texto/ícono por token (danger usa el token error) + hover.
              className={clsx(
                isDanger ? t.fgDanger : t.fg,
                t.hover,
                item.className,
              )}
              description={item.description}
              showDivider={item.showDivider}
              isDisabled={item.isDisabled}
              startContent={startContent}
              endContent={endContent}
            >
              {labelNode}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </HeroDropdown>
  );
};

export default Dropdown;
