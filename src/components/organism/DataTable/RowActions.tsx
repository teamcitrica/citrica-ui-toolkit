"use client";
import React from "react";

import { Button } from "../../atoms/Button";
import Icon from "../../atoms/Icon/Icon";
import { Dropdown } from "../../atoms/Dropdown";
import type { RowAction } from "./types";

// Columna de acciones de los paneles Cítrica: un ojo para ver el detalle y
// tres puntos con el resto (Editar, Eliminar…). La comparten DataTable y
// SortableTable para que las dos tablas se vean y se usen igual.

// Los botones flat del sistema pintan su hover con tokens propios (en la paleta
// admin, fondo verde y texto morado) y ese :hover queda pegado al tocar en
// celular: aquí se redefinen para que el hover sea transparente y el ícono
// conserve su color.
const iconActionStyle = {
  "--color-admin-flat-btn-hover": "transparent",
  "--color-admin-flat-btn-text-hover": "var(--ct-row-action-color)",
  "--color-flat-btn-hover": "transparent",
  "--color-flat-btn-text-hover": "var(--ct-row-action-color)",
} as React.CSSProperties;

const iconActionClass =
  "!h-8 !w-8 !min-w-0 !p-1 !outline-0 hover:!bg-transparent text-[color:var(--ct-row-action-color)]";

export interface RowActionsProps<T> {
  item: T;
  onView?: (item: T) => void;
  rowActions?: RowAction<T>[] | ((item: T) => RowAction<T>[]);
  isAdmin?: boolean;
  /** Color de los íconos (CSS). */
  color: string;
  viewLabel: string;
  moreLabel: string;
}

export function RowActions<T>({ item, onView, rowActions, isAdmin = false, color, viewLabel, moreLabel }: RowActionsProps<T>) {
  const options = (typeof rowActions === "function" ? rowActions(item) : (rowActions ?? [])).filter(
    (a) => !a.isHidden?.(item),
  );

  return (
    <div
      // `-mr-1.5`: cada ícono va centrado en un botón de 32px; sin este ajuste
      // el último quedaba 6px antes del final del encabezado "ACCIONES".
      className="relative -mr-1.5 flex items-center justify-end"
      style={{ "--ct-row-action-color": color } as React.CSSProperties}
      // Que un clic en las acciones no dispare también el clic de la fila.
      onClick={(e) => e.stopPropagation()}
    >
      {onView && (
        <Button
          isIconOnly
          aria-label={viewLabel}
          className={iconActionClass}
          isAdmin={isAdmin}
          style={iconActionStyle}
          variant="flat"
          onPress={() => onView(item)}
        >
          <Icon className="h-5 w-5 text-[color:var(--ct-row-action-color)]" name="Eye" />
        </Button>
      )}
      {options.length > 0 && (
        <Dropdown
          ariaLabel={moreLabel}
          isAdmin={isAdmin}
          items={options.map((a) => ({
            key: a.key,
            label: a.label,
            startIcon: a.icon,
            color: a.danger ? ("danger" as const) : undefined,
          }))}
          trigger={
            <Button
              isIconOnly
              aria-label={moreLabel}
              className={iconActionClass}
              isAdmin={isAdmin}
              style={iconActionStyle}
              variant="flat"
            >
              <Icon className="h-5 w-5 text-[color:var(--ct-row-action-color)]" name="EllipsisVertical" />
            </Button>
          }
          onAction={(key) => options.find((a) => a.key === key)?.onAction(item)}
        />
      )}
    </div>
  );
}

export default RowActions;
