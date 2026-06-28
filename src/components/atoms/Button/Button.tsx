"use client";
import React from "react";
import { Text } from "../Text/Text";
import { Button as HeroUIButton, ButtonProps as HeroUIButtonProps } from "@heroui/button";
import clsx from "clsx";
import Icon, { IconName } from "../Icon/Icon";

// `size` y `color` se omiten del tipo base porque los redefinimos con
// valores propios (size añade "xs"; color pasa a ser un color CSS libre).
export interface ButtonProps
  extends Omit<HeroUIButtonProps, "variant" | "size" | "color"> {
  onPress?: () => void;
  label?: string;
  children?: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "flat"
    | "link"
    | "success"
    | "warning"
    | "danger";
  textVariant?:
    | "label"
    | "body"
    | "title"
    | "display"
    | "headline"
    | "subtitle";
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
  isDisabled?: boolean;
  isIconOnly?: boolean;
  isAdmin?: boolean;
  isLoading?: boolean;
  startIcon?: IconName;
  endIcon?: IconName;
  /** Tamaño en px de los íconos de startIcon/endIcon (por defecto el del componente Icon). */
  iconSize?: number;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  fullWidth?: boolean;
  /** Color CSS libre del texto (ej. "#FFF" o "var(--color-text-white)"). Tiene prioridad sobre la variante. */
  color?: string;
  /** Token de color del texto (ej. "color-on-primary"). Se usa si no se pasa `color`. */
  textColor?: string;
  /** Si se define, el botón se renderiza como ancla (`<a>`) — ideal para enlaces `tel:`, `mailto:` o navegación. */
  href?: string;
  /** Elemento/componente a renderizar (ej. "a" o el `<Link>` de Next). */
  as?: React.ElementType;
  target?: string;
  rel?: string;
  /** Atajo: abre en pestaña nueva con `rel` seguro. */
  isExternal?: boolean;
  /** Color del TEXTO en hover (variante "link"). Si se omite, el hover es por opacidad. */
  hoverColor?: string;
  /** Color del FONDO en hover (variante "link"). Si se omite, el hover es por opacidad. */
  backgroundHoverColor?: string;
  /**
   * Quita los estilos del sistema (caja `btn-citrica-ui`, fill de la variante y
   * color de texto forzado). El consumidor controla todo vía `className` y el
   * color se hereda (`currentColor`), por lo que el ícono sigue al texto.
   * Conserva la semántica y el comportamiento (as/href, loading, foco, iconos).
   * Ideal para filas de navegación o CTAs con forma propia.
   */
  unstyled?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      label,
      children,
      textVariant = "label",
      variant = "primary",
      size = "md",
      className = "",
      type = "button",
      isDisabled = false,
      isIconOnly = false,
      isAdmin = false,
      isLoading = false,
      fullWidth = false,
      startIcon,
      endIcon,
      iconSize,
      startContent,
      endContent,
      color,
      textColor,
      href,
      as,
      target,
      rel,
      isExternal = false,
      hoverColor,
      backgroundHoverColor,
      unstyled = false,
      style,
      ...props
    },
    ref,
  ) {
    const getBtnClassByVariant = (variant: string, isAdmin: boolean) => {
      switch (variant) {
        case "primary":
          return isAdmin ? "btn-primary-admin" : "btn-primary";
        case "secondary":
          return isAdmin ? "btn-secondary-admin" : "btn-secondary";
        case "success":
          return isAdmin ? "btn-success-admin" : "btn-success";
        case "warning":
          return isAdmin ? "btn-warning-admin" : "btn-warning";
        case "danger":
          return isAdmin ? "btn-danger-admin" : "btn-danger";
        case "flat":
          return isAdmin ? "btn-flat-admin" : "btn-flat";
        case "link":
          return isAdmin ? "btn-link-admin" : "btn-link";
        default:
          return isAdmin ? "btn-primary-admin" : "btn-primary";
      }
    };

    const getTypeOfButton = (isAdmin: boolean) => {
      return isAdmin ? "btn-citrica-ui-admin" : "btn-citrica-ui";
    };

    const getTextColorByVariant = (variant: string, isAdmin: boolean) => {
      switch (variant) {
        case "primary":
          return isAdmin ? "color-admin-on-primary" : "color-on-primary";
        case "secondary":
          return isAdmin ? "color-admin-on-secondary" : "color-on-secondary";
        case "success":
          return isAdmin ? "color-admin-on-success" : "color-on-success";
        case "warning":
          return isAdmin ? "color-admin-warning" : "color-on-warning";
        case "danger":
          return isAdmin ? "color-admin-on-error" : "color-on-error";
        case "flat":
          return isAdmin ? "color-admin-black" : "color-black";
        case "link":
          return isAdmin ? "color-admin-primary" : "color-primary";
        default:
          return isAdmin ? "color-admin-on-primary" : "color-on-primary";
      }
    };

    // Prioridad de color del texto: color (CSS libre) > textColor (token) > el de la variante.
    const resolvedTextColor =
      textColor ?? getTextColorByVariant(variant, isAdmin);
    const textColorProps = color ? { color } : { textColor: resolvedTextColor };

    // Override de color del texto/ícono. Solo se define si el consumidor pasó
    // `color` o `textColor`; en ese caso tiene prioridad en TODAS las variantes
    // (el SCSS usa `var(--btn-text-override, <token de la variante>)`).
    const textOverride = color
      ? color
      : textColor
        ? `var(--${textColor})`
        : undefined;

    // En unstyled el texto hereda el color del contenedor (currentColor), para que
    // ícono y label sigan lo que defina el className del consumidor.
    const labelColorProps = unstyled
      ? { color: "currentColor" }
      : textColorProps;
    const content =
      children ||
      (label && (
        <Text variant={textVariant} {...labelColorProps} isAdmin={isAdmin}>
          {label}
        </Text>
      ));

    const finalStartContent = startIcon ? (
      <Icon name={startIcon} size={iconSize} />
    ) : (
      startContent
    );
    const finalEndContent = endIcon ? (
      <Icon name={endIcon} size={iconSize} />
    ) : (
      endContent
    );

    // "xs" no existe en HeroUI: usamos "sm" y compactamos vía clase propia.
    const heroSize = size === "xs" ? "sm" : size;

    // Hover personalizado: pasamos los colores como CSS custom properties y el
    // SCSS los consume en :hover (no se puede estilar :hover inline). Si se define
    // algún color, una clase modificadora desactiva el hover por opacidad.
    // Las CSS vars apuntan al SCSS de las variantes; en unstyled no aplican.
    const styleVars: Record<string, string> = {};

    if (!unstyled) {
      if (textOverride) styleVars["--btn-text-override"] = textOverride;
      if (hoverColor) styleVars["--btn-hover-text"] = hoverColor;
      if (backgroundHoverColor)
        styleVars["--btn-hover-bg"] = backgroundHoverColor;
    }
    const mergedStyle = { ...style, ...styleVars } as React.CSSProperties;

    // Si hay href (o as="a"), renderizamos un ancla real: `type` no aplica a <a>.
    const isLink = Boolean(href) || as === "a";
    const elementProps = isLink
      ? {
          as: as ?? "a",
          href,
          target: isExternal ? "_blank" : target,
          rel: isExternal ? "noopener noreferrer" : rel,
        }
      : { type };

    return (
      <HeroUIButton
        // El spread va primero; las props controladas debajo tienen precedencia.
        {...props}
        ref={ref}
        {...elementProps}
        className={clsx(
          !unstyled && getBtnClassByVariant(variant, isAdmin),
          !unstyled && getTypeOfButton(isAdmin),
          !unstyled && isIconOnly && "btn-icon-only-citrica-ui",
          !unstyled &&
            size === "xs" &&
            (isAdmin ? "btn-xs-citrica-ui-admin" : "btn-xs-citrica-ui"),
          !unstyled && hoverColor && "btn-hover-text",
          !unstyled && backgroundHoverColor && "btn-hover-bg",
          className,
        )}
        endContent={finalEndContent}
        fullWidth={fullWidth}
        isDisabled={isDisabled}
        isIconOnly={isIconOnly}
        isLoading={isLoading}
        size={heroSize}
        startContent={finalStartContent}
        style={mergedStyle}
      >
        {content}
      </HeroUIButton>
    );
  },
);

Button.displayName = "Button";

export default Button;
