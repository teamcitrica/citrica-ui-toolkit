"use client";
import React from "react";
import {
  Drawer as HeroDrawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@heroui/drawer";
import clsx from "clsx";
import { Text } from "../../atoms/Text";
import type { DrawerProps } from "./types";

// Tokens del drawer como CSS vars, con fallback. `isAdmin` decide la familia de
// tokens (igual que Button/Text): con admin usa `--color-admin-*`; sin admin usa
// los web `--color-*`. Si el proyecto define esos tokens, el drawer se adapta al
// tema (admin/web y claro/oscuro); si no, cae a estos colores (paleta admin light)
// y funciona igual sin SCSS. Se puede sobreescribir vía `style` en el contenedor.
const getDrawerVars = (isAdmin: boolean): React.CSSProperties => {
  const p = isAdmin ? "admin-" : "";
  return {
    "--dw-panel-bg": `var(--color-${p}surface-container-lowest, #ffffff)`,
    "--dw-body-bg": `var(--color-${p}surface, #f0f2f5)`,
    "--dw-fg": `var(--color-${p}on-surface, #1d222b)`,
    "--dw-accent": `var(--color-${p}primary, #265197)`,
    "--dw-border": `var(--color-${p}outline, #b9c2d0)`,
  } as React.CSSProperties;
};

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  header,
  footer,
  placement = "right",
  size = "md",
  customWidth,
  hideCloseButton = false,
  isDismissable = true,
  className,
  classNames,
  isAdmin = false,
  style,
  ...props
}) => {
  // Familia de tokens según isAdmin (admin ↔ web).
  const drawerVars = getDrawerVars(isAdmin);

  // Con customWidth ignoramos `size` y forzamos el ancho por style.
  const widthStyle: React.CSSProperties = customWidth
    ? { width: customWidth, maxWidth: customWidth }
    : {};

  return (
    <HeroDrawer
      isOpen={isOpen}
      onClose={onClose}
      placement={placement}
      size={customWidth ? undefined : size}
      hideCloseButton={hideCloseButton}
      isDismissable={isDismissable}
      // `style` va sobre la base/panel: aquí inyectamos las CSS vars (cascadean a
      // header/body/footer) y el ancho fijo. Un `style` del consumidor gana.
      style={{ ...drawerVars, ...widthStyle, ...style }}
      className={clsx("drawer-citrica-ui", className)}
      classNames={{
        base: clsx("bg-[var(--dw-panel-bg)]", classNames?.base),
        backdrop: classNames?.backdrop,
        // Botón cerrar circular con el color de acento; el hover invierte a sólido.
        closeButton: clsx(
          "my-auto flex h-8 w-8 min-w-8 items-center justify-center rounded-full border-2 border-[var(--dw-accent)] text-[var(--dw-accent)] transition-colors hover:bg-[var(--dw-accent)] hover:text-white",
          classNames?.closeButton,
        ),
      }}
      {...props}
    >
      <DrawerContent>
        {(header || title) && (
          <DrawerHeader
            className={clsx(
              "flex flex-col gap-1 border-b border-[var(--dw-border)]",
              classNames?.header,
            )}
          >
            {header ||
              (title && (
                <Text
                  variant="subtitle"
                  weight="bold"
                  color="var(--dw-accent)"
                  isAdmin={isAdmin}
                >
                  {title}
                </Text>
              ))}
          </DrawerHeader>
        )}

        <DrawerBody
          className={clsx(
            "bg-[var(--dw-body-bg)] py-6 text-[var(--dw-fg)]",
            classNames?.body,
          )}
        >
          {children}
        </DrawerBody>

        {footer && (
          <DrawerFooter
            className={clsx(
              "border-t border-[var(--dw-border)]",
              classNames?.footer,
            )}
          >
            {footer}
          </DrawerFooter>
        )}
      </DrawerContent>
    </HeroDrawer>
  );
};

export default Drawer;
