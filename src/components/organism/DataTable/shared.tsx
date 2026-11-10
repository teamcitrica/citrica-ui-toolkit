"use client";
import React from "react";

import { Button } from "../../atoms/Button";
import Icon from "../../atoms/Icon/Icon";
import Input from "../../atoms/Input/Input";
import { Dropdown } from "../../atoms/Dropdown";

// Piezas que comparten DataTable y SortableTable: la tarjeta, los colores, el
// buscador, los botones de la barra (Descargar / Agregar) y los textos comunes.
// Un cambio de estilo se hace aquí una sola vez y llega a las dos tablas.

// Tarjeta blanca que envuelve barra + tabla, como `container-blue-principal`
// en citrica-web y Dumbbelldance: fondo de superficie, 16px de relleno,
// esquinas de 20px y sombra suave. `min-w-0` para que el scroll horizontal de
// la tabla quede dentro de la tarjeta en pantallas chicas.
export const CARD_CLASS =
  "min-w-0 max-w-full rounded-[20px] p-4 bg-[color:var(--ct-card-bg)] shadow-[0px_1px_2px_0px_#0000004D]";

/** Textos por defecto comunes a las dos tablas. */
export const BASE_LABELS = {
  search: "Buscar...",
  add: "Agregar",
  export: "Descargar",
  exportAriaLabel: "Opciones de exportación",
  excelItem: "Excel (.xlsx)",
  csvItem: "CSV (.csv)",
  actions: "Acciones",
  view: "Ver detalle",
  moreActions: "Más acciones",
};

export interface TableColorOptions {
  isAdmin: boolean;
  headerColor?: string;
  headerTextColor?: string;
  accentColor?: string;
  stripeColor?: string;
  borderColor?: string;
  mutedColor?: string;
}

/**
 * Colores de las tablas como variables CSS `--ct-dt-*`, con los tokens admin o
 * web según `isAdmin`. Cada color es `override ?? var(--color-[admin-]token, respaldo)`.
 */
export function getTableColors({
  isAdmin,
  headerColor,
  headerTextColor,
  accentColor,
  stripeColor,
  borderColor,
  mutedColor,
}: TableColorOptions) {
  const p = isAdmin ? "admin-" : "";
  const accent = accentColor ?? `var(--color-${p}primary, #265197)`;
  const muted = mutedColor ?? `var(--color-${p}outline, #9FB2C0)`;

  const vars = {
    "--ct-dt-header-bg": headerColor ?? `var(--color-${p}primary, #265197)`,
    "--ct-dt-header-text": headerTextColor ?? `var(--color-${p}on-primary, #FFFFFF)`,
    "--ct-dt-accent": accent,
    "--ct-dt-stripe": stripeColor ?? `var(--color-${p}surface-container, #EAECF1)`,
    "--ct-dt-border": borderColor ?? `var(--color-${p}outline, #C8D2D4)`,
    "--ct-dt-muted": muted,
    // Texto secundario legible sobre blanco (avisos, número de posición…).
    "--ct-dt-subtle": `var(--color-${p}outline-variant, #8192AB)`,
    // Buscador y filtros con el estilo de los paneles Cítrica: borde suave que
    // toma el color de acento al pasar el cursor o escribir.
    "--ct-dt-input-border": `var(--color-${p}primary-container, #D4DEED)`,
    // Esquinas y grosor del borde de los campos: tokens de formulario
    // (_form.scss), admin o web.
    "--ct-dt-input-radius": isAdmin
      ? "var(--form-admin-radius-input, 10px)"
      : "var(--form-radius-input, 10px)",
    "--ct-dt-input-border-size": isAdmin
      ? "var(--form-admin-border-size-input, 1px)"
      : "var(--form-border-size-input, 1px)",
    "--ct-dt-input-placeholder": isAdmin
      ? "var(--color-admin-primary-fixed-dim, #678CC5)"
      : "var(--color-primary-input-placeholder, #6E6A65)",
    "--ct-dt-chip-bg": isAdmin
      ? "var(--color-admin-on-primary-fixed-variant, #EEF1F7)"
      : "var(--color-primary-container, #FDEFE8)",
    // Filas (SortableTable): fondo, línea, hover y fila arrastrándose.
    "--ct-dt-row-bg": `var(--color-${p}surface-container-lowest, #FFFFFF)`,
    "--ct-dt-row-border": `var(--color-${p}surface-container, #EAECF1)`,
    "--ct-dt-hover-bg": `var(--color-${p}surface, #F0F2F5)`,
    "--ct-dt-drag-bg": `var(--color-${p}primary-container, #D4DEED)`,
    "--ct-card-bg": `var(--color-${p}surface-container-lowest, #FFFFFF)`,
    // La fuente sigue la familia admin/web, para el contenido de la tabla que
    // no pasa por <Text>. Los <Text> internos mantienen su propia fuente.
    fontFamily: isAdmin ? "var(--font-family-b-admin)" : "var(--font-family-b)",
  } as React.CSSProperties;

  return { vars, accent, muted };
}

/** Buscador de la barra, con el estilo de los paneles Cítrica. */
export function TableSearch({
  value,
  onChange,
  placeholder,
  accent,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  accent: string;
}) {
  return (
    <Input
      className="w-full sm:w-64 !p-0"
      classNames={{
        inputWrapper:
          "!bg-transparent !border-[length:var(--ct-dt-input-border-size)] !border-[color:var(--ct-dt-input-border)] !rounded-[var(--ct-dt-input-radius)] data-[hover=true]:!border-[color:var(--ct-dt-accent)] focus-within:!border-[color:var(--ct-dt-accent)]",
        label: "!text-[color:var(--ct-dt-accent)]",
        input: "!text-[color:var(--ct-dt-accent)] placeholder:!text-[color:var(--ct-dt-input-placeholder)]",
      }}
      placeholder={placeholder}
      startContent={<Icon color={accent} name="Search" size={16} />}
      type="text"
      value={value}
      variant="faded"
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/** Botones de la derecha de la barra: acciones propias, Descargar y Agregar. */
export function TableToolbarActions({
  isAdmin,
  headerActions,
  enableExport,
  onExportFormat,
  exportIcon,
  onAdd,
  addLabel,
  addIcon,
  labels,
}: {
  isAdmin: boolean;
  headerActions?: React.ReactNode;
  enableExport: boolean;
  onExportFormat: (format: string) => void;
  exportIcon?: React.ReactNode;
  onAdd?: () => void;
  addLabel: string;
  addIcon: React.ReactNode;
  labels: Pick<typeof BASE_LABELS, "export" | "exportAriaLabel" | "excelItem" | "csvItem">;
}) {
  return (
    <div className="flex flex-shrink-0 items-center gap-2">
      {headerActions}
      {enableExport && (
        <Dropdown
          ariaLabel={labels.exportAriaLabel}
          isAdmin={isAdmin}
          items={[
            { key: "excel", label: labels.excelItem, startIcon: "FileSpreadsheet" },
            { key: "csv", label: labels.csvItem, startIcon: "FileText" },
          ]}
          trigger={
            <Button
              className="w-full sm:w-auto"
              isAdmin={isAdmin}
              label={labels.export}
              startContent={exportIcon || <Icon name="Download" size={16} />}
              variant="primary"
            />
          }
          onAction={onExportFormat}
        />
      )}
      {onAdd && (
        <Button
          className="w-full sm:w-auto"
          isAdmin={isAdmin}
          label={addLabel}
          startContent={addIcon}
          variant="primary"
          onPress={onAdd}
        />
      )}
    </div>
  );
}
