"use client";
import React from "react";
import { Switch as HeroSwitch } from "@heroui/switch";
import clsx from "clsx";
import type { SwitchProps } from "./types";

// Mapea la prop `variant` al token base del sistema (danger usa el token `error`).
const VARIANT_TOKEN: Record<string, string> = {
  primary: "primary",
  secondary: "secondary",
  success: "success",
  warning: "warning",
  danger: "error",
};

export const Switch: React.FC<SwitchProps> = ({
  variant = "primary",
  isAdmin = false,
  className,
  classNames,
  children,
  style,
  ...props
}) => {
  // `isAdmin` decide la familia de tokens (admin ↔ web), igual que Drawer/Text.
  const p = isAdmin ? "admin-" : "";
  // Color del track encendido, tomado del token; el consumidor puede sobreescribir
  // pasando --sw-on por `style`.
  const onColor = `var(--color-${p}${VARIANT_TOKEN[variant] ?? "primary"})`;

  return (
    <HeroSwitch
      className={clsx("switch-citrica-ui", className)}
      style={{ ["--sw-on"]: onColor, ...style } as React.CSSProperties}
      classNames={{
        ...classNames,
        // El track toma el color del token cuando está seleccionado.
        wrapper: clsx(
          "group-data-[selected=true]:!bg-[var(--sw-on)]",
          classNames?.wrapper,
        ),
      }}
      {...props}
    >
      {children}
    </HeroSwitch>
  );
};

export default Switch;
