"use client";
import React from "react";
import { Text } from "../../atoms/Text";

// Grupo de botones para filtrar ("Todos / Con acceso / Sin acceso"), como el de
// citrica-web: una franja de fondo suave y el botón elegido en blanco. Se usa
// arriba de las tablas (prop `tabs` de DataTable) o en cualquier página.
//
// Son <button> nativos y no el Button del sistema: el hover de las variantes
// del Button pinta fondo y texto con sus propios tokens (con `!important`) y
// había que neutralizarlo botón por botón.

export interface FilterButton {
  value: string;
  label: string;
  /** Contenido opcional a la derecha del texto (ej. un punto de estado o un contador). */
  badge?: React.ReactNode;
}

export interface FilterButtonGroupProps {
  buttons: FilterButton[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  /** Tokens admin (`--color-admin-*`) o web (`--color-*`). Default: web, como el resto de componentes. */
  isAdmin?: boolean;
  /** Etiqueta accesible del grupo (ej. "Filtrar por acceso"). */
  ariaLabel?: string;
  className?: string;
}

export function FilterButtonGroup({
  buttons,
  selectedValue,
  onValueChange,
  isAdmin = false,
  ariaLabel,
  className = "",
}: FilterButtonGroupProps) {
  const p = isAdmin ? "admin-" : "";
  const vars = {
    "--fbg-bg": `var(--color-${p}primary-container, #D4DEED)`,
    "--fbg-active-bg": `var(--color-${p}surface-container-lowest, #FFFFFF)`,
    "--fbg-fg": `var(--color-${p}primary, #265197)`,
  } as React.CSSProperties;

  return (
    <div
      aria-label={ariaLabel}
      className={`filter-button-group-citrica-ui ${isAdmin ? "filter-button-group-citrica-ui-admin" : ""} inline-flex max-w-full rounded-md bg-[color:var(--fbg-bg)] p-1 max-md:flex max-md:w-full ${className}`}
      role="group"
      style={vars}
    >
      {buttons.map((button) => {
        const isActive = button.value === selectedValue;
        return (
          <button
            key={button.value}
            aria-pressed={isActive}
            className={`inline-flex min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-4 py-1.5 text-[color:var(--fbg-fg)] transition-colors max-md:flex-1 max-md:px-2 motion-reduce:transition-none ${
              isActive ? "bg-[color:var(--fbg-active-bg)] shadow-sm" : "bg-transparent hover:bg-[color:var(--fbg-active-bg)]/60"
            }`}
            type="button"
            onClick={() => onValueChange(button.value)}
          >
            <Text as="span" color="inherit" isAdmin={isAdmin} variant="label" weight={isActive ? "bold" : "normal"}>
              {button.label}
            </Text>
            {button.badge}
          </button>
        );
      })}
    </div>
  );
}

export default FilterButtonGroup;
