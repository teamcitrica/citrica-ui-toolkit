import * as React from "react";

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?:
    | "display"
    | "headline"
    | "title"
    | "subtitle"
    | "body"
    | "label"
    | "headlinecustom";
  weight?: "light" | "normal" | "bold";
  color?: string;
  textColor?: string;
  className?: string;
  isAdmin?: boolean;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div" | "a";
  /** URL de destino. Si se define (o `as="a"`), el texto se vuelve un enlace clickeable. */
  href?: string;
  /** Destino del enlace (ej. "_blank"). */
  target?: string;
  /** Relación del enlace. Si abre en "_blank" y no se especifica, se usa "noopener noreferrer". */
  rel?: string;
  /** Decoración del texto. Soporta subrayado y tachado para cualquier variante. */
  textDecoration?: "underline" | "line-through";
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = "body",
  color,
  weight = "normal",
  textColor,
  className = "",
  as: Component = "span",
  isAdmin = false,
  href,
  target,
  rel,
  textDecoration,
  style: styleProp,
  ...rest
}) => {
  // Es un enlace si se renderiza como <a> o si se pasa un href.
  const isLink = Component === "a" || href != null;

  // Color: `color` explícito > `textColor` (token) > color de enlace > negro por defecto.
  const resolvedColor = color
    ? color
    : textColor
      ? `var(--${textColor})`
      : isLink
        ? "var(--color-text-link)"
        : "var(--color-black)";

  const weightClass = weight !== "normal" ? `text-${variant}-${weight}` : "";

  const isAdminSuffix = isAdmin ? "-admin" : "";

  const classes = [
    `text-${variant}${isAdminSuffix}`,
    "text-component",
    weightClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Si el enlace abre en otra pestaña, aplicamos un `rel` seguro por defecto.
  const safeRel =
    isLink && target === "_blank" ? (rel ?? "noopener noreferrer") : rel;

  // Atributos propios de enlace, sólo cuando corresponde.
  const linkProps = isLink ? { href, target, rel: safeRel } : {};

  // Estilo final: color resuelto + decoración opcional; un `style` explícito
  // del consumidor tiene prioridad sobre ambos.
  const style: React.CSSProperties = {
    color: resolvedColor,
    ...(textDecoration ? { textDecoration } : {}),
    ...styleProp,
  };

  return (
    <Component className={classes} style={style} {...linkProps} {...rest}>
      {children}
    </Component>
  );
};
