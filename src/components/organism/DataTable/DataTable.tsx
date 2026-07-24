"use client";
import React, { useCallback, useMemo } from "react";
import { Skeleton } from "@heroui/skeleton";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";

import { Text } from "../../atoms/Text";
import { Button } from "../../atoms/Button";
import Icon from "../../atoms/Icon/Icon";
import Input from "../../atoms/Input/Input";
import Select from "../../atoms/Select/Select";
import { Dropdown } from "../../atoms/Dropdown";

import ExportModal from "./ExportModal";
import { useTableFeatures } from "./hooks/useTableFeatures";
import { useTableExport } from "./hooks/useTableExport";
import type { Column, DataTableProps } from "./types";

export type { ExportColumn } from "./hooks/useTableExport";

const DEFAULT_LABELS = {
  search: "Buscar...",
  add: "Agregar",
  actions: "ACCIONES",
  export: "Descargar",
  rowsPerPage: "Filas por página",
  ariaLabel: "Tabla de datos",
  exportAriaLabel: "Opciones de exportación",
  excelItem: "Excel (.xlsx)",
  csvItem: "CSV (.csv)",
  activeFilterLabel: "Filtro activo:",
};

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  getRowKey,
  isLoading = false,
  isAdmin = false,
  searchFields = [],
  searchPlaceholder,
  defaultSortColumn,
  defaultSortDirection = "ascending",
  itemsPerPage = 8,
  showRowsPerPageSelector = false,
  rowsPerPageOptions = [8, 15, 25, 50],
  onPageSizeChange,
  onAdd,
  addButtonText,
  addButtonIcon,
  renderActions,
  enableExport = false,
  exportColumns = [],
  exportButtonIcon,
  tableName = "tabla",
  emptyContent = "No se encontraron registros",
  customFilters,
  headerFilters,
  headerActions,
  showFilterIndicators = false,
  totalRecordsLabel,
  activeFilters = [],
  permanentFilters = [],
  headerColor,
  headerTextColor,
  accentColor,
  stripeColor,
  borderColor,
  mutedColor,
  paginationColor,
  className = "",
  customContainerClass = "",
  removeWrapper = false,
  labels,
  server,
}: DataTableProps<T>) {
  const t = { ...DEFAULT_LABELS, ...labels };
  const isServer = Boolean(server);

  // Familia de tokens según isAdmin; cada color resuelve como
  // `override ?? var(--color-[admin-]token, #fallbackActual)`.
  const p = isAdmin ? "admin-" : "";
  const headerBg = headerColor ?? `var(--color-${p}primary, #083D77)`;
  const headerText = headerTextColor ?? `var(--color-${p}on-primary, #ffffff)`;
  const accent =
    accentColor ?? paginationColor ?? `var(--color-${p}primary, #083D77)`;
  const stripe = stripeColor ?? `var(--color-${p}surface-container, #E2E6E1)`;
  const border = borderColor ?? `var(--color-${p}outline, #C8D2D4)`;
  const muted = mutedColor ?? `var(--color-${p}outline, #9FB2C0)`;

  // Tokens de color expuestos como CSS variables para el theming interno.
  // La fuente del contenedor sigue la familia admin/web para que el contenido
  // "plano" de la tabla (headers/celdas, que no pasan por <Text>) herede la
  // tipografía correcta. Los <Text> internos mantienen su propia fuente.
  const styleVars = {
    "--ct-dt-header-bg": headerBg,
    "--ct-dt-header-text": headerText,
    "--ct-dt-accent": accent,
    "--ct-dt-stripe": stripe,
    "--ct-dt-border": border,
    "--ct-dt-muted": muted,
    fontFamily: isAdmin
      ? "var(--font-family-b-admin)"
      : "var(--font-family-b)",
  } as React.CSSProperties;

  const tableFeatures = useTableFeatures<T>({
    data,
    initialRowsPerPage: itemsPerPage,
    searchFields,
    defaultSortColumn: defaultSortColumn ?? (columns[0]?.uid as keyof T),
    defaultSortDirection,
  });

  const exportFeatures = useTableExport<T>({
    rows: isServer ? data : tableFeatures.filteredItems,
    tableName,
  });

  // Filas visibles: en modo servidor los datos ya vienen paginados.
  const visibleItems = isServer ? data : tableFeatures.paginatedItems;

  // Agregar columna de acciones si hay renderActions.
  const tableColumns = useMemo(() => {
    if (renderActions) {
      return [...columns, { name: t.actions, uid: "actions" }];
    }

    return columns;
  }, [columns, renderActions, t.actions]);

  const renderCell = useCallback(
    (item: T, columnKey: React.Key) => {
      if (columnKey === "actions" && renderActions) {
        return renderActions(item);
      }

      const column = columns.find((col) => col.uid === columnKey);

      if (column?.render) {
        return column.render(item);
      }

      const value = item[columnKey as keyof T];

      if (value === null || value === undefined) {
        return "-";
      }

      return String(value);
    },
    [columns, renderActions],
  );

  const handleSortChange = (descriptor: {
    column?: React.Key;
    direction?: "ascending" | "descending";
  }) => {
    // Siempre actualizamos el estado local para que la flecha de orden
    // refleje la selección, incluso en modo servidor.
    tableFeatures.setSortDescriptor(descriptor as any);
    if (isServer && server?.onSortChange && descriptor.column) {
      server.onSortChange(
        descriptor.column as string,
        (descriptor.direction ?? "ascending") as "ascending" | "descending",
      );
    }
  };

  const handleRowsPerPageChange = (size: number) => {
    tableFeatures.onRowsPerPageChange(size);
    onPageSizeChange?.(size);
  };

  const searchValue = isServer
    ? (server?.searchValue ?? "")
    : tableFeatures.filterValue;

  const onSearch = (value: string) => {
    if (isServer) {
      server?.onSearchChange?.(value);
    } else {
      tableFeatures.onSearchChange(value);
    }
  };

  const paginationClassNames = {
    cursor: "bg-[color:var(--ct-dt-accent)] text-white shadow-none",
    item: "border-none shadow-none outline-none ring-0",
    prev: "border-none shadow-none outline-none ring-0",
    next: "border-none shadow-none outline-none ring-0",
  };

  const showToolbar =
    searchFields.length > 0 || headerActions || enableExport || onAdd;

  const clientTotalPages = tableFeatures.pages;
  const serverTotalPages = server
    ? Math.max(1, Math.ceil(server.totalRecords / tableFeatures.rowsPerPage))
    : 1;

  return (
    <div
      className={`${customContainerClass} h-full flex flex-col ${className}`}
      style={styleVars}
    >
      {/* Custom Filters en su propia fila */}
      {customFilters && (
        <div className="w-full flex-shrink-0">{customFilters}</div>
      )}

      {/* Barra de búsqueda y acciones */}
      {showToolbar && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full py-3 flex-shrink-0 gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 min-w-0">
            {/* Input de búsqueda */}
            {searchFields.length > 0 && (
              <Input
                className="w-full sm:w-56"
                classNames={{
                  inputWrapper:
                    "!border-[color:var(--ct-dt-border)] !rounded-[12px] data-[hover=true]:!border-[color:var(--ct-dt-accent)]",
                  label: "!text-[color:var(--ct-dt-accent)]",
                  input:
                    "placeholder:text-[color:var(--ct-dt-muted)] !text-black",
                }}
                placeholder={searchPlaceholder || t.search}
                startContent={<Icon color={accent} name="Search" size={16} />}
                type="text"
                value={searchValue}
                variant="faded"
                onChange={(e) => onSearch(e.target.value)}
              />
            )}

            {headerFilters}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {headerActions}
            {enableExport && (
              <Dropdown
                isAdmin={isAdmin}
                ariaLabel={t.exportAriaLabel}
                trigger={
                  <Button
                    isAdmin={isAdmin}
                    className="w-full sm:w-auto"
                    label={t.export}
                    startContent={
                      exportButtonIcon || <Icon name="Download" size={16} />
                    }
                    variant="primary"
                  />
                }
                items={[
                  { key: "excel", label: t.excelItem, startIcon: "FileSpreadsheet" },
                  { key: "csv", label: t.csvItem, startIcon: "FileText" },
                ]}
                onAction={(key) => exportFeatures.openModal(key)}
              />
            )}

            {onAdd && (
              <Button
                isAdmin={isAdmin}
                className="w-full sm:w-auto"
                label={addButtonText || t.add}
                startContent={
                  addButtonIcon || <Icon name="UserPlus" size={16} />
                }
                variant="primary"
                onPress={onAdd}
              />
            )}
          </div>
        </div>
      )}

      {/* Indicadores de filtros activos */}
      {showFilterIndicators && (
        <>
          <Divider className="mb-4" />
          <div className="flex gap-2 items-center pb-4">
            {totalRecordsLabel && (
              <p>
                <Text color={accent} isAdmin={isAdmin} variant="label">
                  {totalRecordsLabel}
                </Text>
              </p>
            )}
            {totalRecordsLabel &&
              (permanentFilters.length > 0 || activeFilters.length > 0) && (
                <Divider
                  className="h-[20px] bg-[color:var(--ct-dt-muted)]"
                  orientation="vertical"
                />
              )}

            {/* Filtros permanentes */}
            {permanentFilters.length > 0 && (
              <div className="flex items-center gap-2">
                <span>
                  <Text color={accent} isAdmin={isAdmin} variant="label">
                    {t.activeFilterLabel}
                  </Text>
                </span>
                {permanentFilters.map((filter) => (
                  <span key={`${filter.column}-${filter.value}`}>
                    <Text color={accent} isAdmin={isAdmin} variant="label">
                      {filter.column} = {filter.value}
                    </Text>
                  </span>
                ))}
              </div>
            )}
            {permanentFilters.length > 0 && activeFilters.length > 0 && (
              <Divider
                className="h-[20px] bg-[color:var(--ct-dt-muted)]"
                orientation="vertical"
              />
            )}

            {/* Chips de filtros activos */}
            <div className="space-y-2">
              {activeFilters.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {activeFilters.map((filter) => (
                    <Chip
                      key={`${filter.label}-${filter.value}`}
                      classNames={{
                        base: "!border-[color:var(--ct-dt-muted)]",
                      }}
                      color="default"
                      endContent={
                        <button
                          aria-label="Cerrar"
                          className="cursor-pointer flex items-center"
                          type="button"
                          onClick={filter.onClear}
                        >
                          <Icon color={muted} name="X" size={16} />
                        </button>
                      }
                      size="sm"
                      variant="bordered"
                      onClose={filter.onClear}
                    >
                      {filter.value}
                    </Chip>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Contenedor de tabla con scroll horizontal y vertical */}
      <div className="table-scroll-container flex-1 overflow-x-auto">
        <Table
          isStriped
          aria-label={t.ariaLabel}
          classNames={{
            wrapper: "!p-0 rounded-2px",
            tr: "data-[odd=true]:bg-[color:var(--ct-dt-stripe)]",
          }}
          removeWrapper={removeWrapper}
          selectionMode="none"
          sortDescriptor={tableFeatures.sortDescriptor}
          onSortChange={handleSortChange}
        >
          <TableHeader columns={tableColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={(column as Column<T>).align || "start"}
                allowsSorting={(column as Column<T>).sortable}
                style={{
                  backgroundColor: "var(--ct-dt-header-bg)",
                  color: "var(--ct-dt-header-text)",
                }}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={emptyContent} items={visibleItems}>
            {isLoading
              ? Array.from({
                  length: Math.min(tableFeatures.rowsPerPage, 10),
                }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {tableColumns.map((col) => (
                      <TableCell key={col.uid}>
                        <Skeleton className="h-6 w-full rounded-lg" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : (item: T) => (
                  <TableRow key={getRowKey(item)} className="items-center">
                    {(columnKey: React.Key) => (
                      <TableCell>{renderCell(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>

      {/* Pie: selector de filas por página (izq) + paginación (centrada). */}
      <div className="flex flex-col sm:flex-row items-center gap-2 mt-4 flex-shrink-0">
        <div className="sm:flex-1 flex sm:justify-start">
          {showRowsPerPageSelector && !isServer ? (
            <div className="flex items-center gap-2">
              <Text color={accent} isAdmin={isAdmin} variant="label">
                {t.rowsPerPage}
              </Text>
              <Select
                className="w-24"
                options={rowsPerPageOptions.map((n) => ({
                  value: String(n),
                  label: String(n),
                }))}
                selectedKeys={[String(tableFeatures.rowsPerPage)]}
                variant="bordered"
                onSelectionChange={(keys: any) => {
                  const key = Array.from(keys)[0];

                  if (key) handleRowsPerPageChange(Number(key));
                }}
              />
            </div>
          ) : null}
        </div>

        {isServer
          ? server!.totalRecords > 0 && (
              <Pagination
                isCompact
                showControls
                showShadow
                classNames={paginationClassNames}
                page={server!.page}
                total={serverTotalPages}
                onChange={server!.onPageChange}
              />
            )
          : clientTotalPages > 1 && (
              <Pagination
                isCompact
                showControls
                showShadow
                classNames={paginationClassNames}
                page={tableFeatures.page}
                total={clientTotalPages}
                onChange={tableFeatures.setPage}
              />
            )}

        {/* Espaciador derecho: equilibra al selector para centrar la paginación. */}
        <div className="hidden sm:block sm:flex-1" />
      </div>

      {/* Modal de exportación */}
      {enableExport && (
        <ExportModal
          exportFormat={exportFeatures.exportFormat}
          fileName={exportFeatures.fileName}
          isAdmin={isAdmin}
          isLoading={exportFeatures.isExporting}
          isOpen={exportFeatures.isModalOpen}
          labels={labels}
          onClose={() => exportFeatures.setIsModalOpen(false)}
          onConfirm={() =>
            exportFeatures.confirmExport(
              exportColumns,
              isServer ? server?.onExport : undefined,
            )
          }
          onFileNameChange={exportFeatures.setFileName}
        />
      )}
    </div>
  );
}

export default DataTable;
