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
import type { DropdownProps } from "./types";

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  onAction,
  isAdmin = false,
  ariaLabel = "Menú de acciones",
  placement = "bottom-end",
  disabledKeys,
  className,
  classNames,
  menuClassNames,
  ...props
}) => {
  return (
    <HeroDropdown
      className={clsx(
        isAdmin ? "dropdown-citrica-ui-admin" : "dropdown-citrica-ui",
        className,
      )}
      classNames={classNames}
      placement={placement}
      {...props}
    >
      <DropdownTrigger>{trigger}</DropdownTrigger>

      <DropdownMenu
        aria-label={ariaLabel}
        onAction={(key) => onAction?.(String(key))}
        disabledKeys={disabledKeys}
        classNames={menuClassNames}
      >
        {items.map((item) => {
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

          return (
            <DropdownItem
              key={item.key}
              color={item.color}
              // El color "danger" también pinta el texto (patrón de citrica-web).
              className={clsx(
                item.color === "danger" && "text-danger",
                item.className,
              )}
              description={item.description}
              showDivider={item.showDivider}
              isDisabled={item.isDisabled}
              startContent={startContent}
              endContent={endContent}
            >
              {item.label}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </HeroDropdown>
  );
};

export default Dropdown;
