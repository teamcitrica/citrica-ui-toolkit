"use client";
import React, { useCallback, useMemo } from "react";
import { Skeleton } from "@heroui/skeleton";
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
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import {
  Dropdown as HeroDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";

import { Text } from "../../atoms/Text";
import { Button } from "../../atoms/Button";
import Icon from "../../atoms/Icon/Icon";
import Select from "../../atoms/Select/Select";

import ExportModal from "./ExportModal";
import RowActions from "./RowActions";
import { BASE_LABELS, CARD_CLASS, TableSearch, TableToolbarActions, getTableColors } from "./shared";
import { useTableFeatures } from "./hooks/useTableFeatures";
import { useTableExport } from "./hooks/useTableExport";
import type { Column, DataTableProps } from "./types";

export type { ExportColumn } from "./hooks/useTableExport";

// Línea horizontal entre secciones de la tarjeta. Es un <div> y no un <hr>
// (Divider): los estilos base de los proyectos ponen `hr { margin: 0 }` fuera de
// las capas de Tailwind, y eso anulaba el margen de abajo: lo que seguía quedaba
// pegado a la línea.
const SectionDivider = () => (
  <div
    aria-hidden
    className="mb-4 h-px w-full flex-shrink-0 bg-[color:var(--ct-dt-input-border)]"
  />
);

// Select y Autocomplete del consumidor con el estilo del buscador: fondo
// transparente, borde suave y acento al pasar el cursor o escribir.
const FILTER_FIELDS_CLASS =
  "[&_[data-slot=input-wrapper]]:!rounded-[var(--ct-dt-input-radius)] [&_[data-slot=input-wrapper]]:!border-[length:var(--ct-dt-input-border-size)] [&_[data-slot=input-wrapper]]:!bg-transparent [&_[data-slot=input-wrapper]]:!border-[color:var(--ct-dt-input-border)] [&_[data-slot=input-wrapper]:hover]:!border-[color:var(--ct-dt-accent)] [&_[data-slot=input-wrapper]:focus-within]:!border-[color:var(--ct-dt-accent)] [&_[data-slot=trigger]]:!rounded-[var(--ct-dt-input-radius)] [&_[data-slot=trigger]]:!border-[length:var(--ct-dt-input-border-size)] [&_[data-slot=trigger]]:!bg-transparent [&_[data-slot=trigger]]:!border-[color:var(--ct-dt-input-border)] [&_[data-slot=trigger]:hover]:!border-[color:var(--ct-dt-accent)] [&_[data-slot=trigger][data-open=true]]:!border-[color:var(--ct-dt-accent)] [&_[data-slot=value]]:!text-[color:var(--ct-dt-accent)] [&_input]:!text-[color:var(--ct-dt-accent)] [&_input::placeholder]:!text-[color:var(--ct-dt-input-placeholder)] [&_[data-slot=selector-button]]:!text-[color:var(--ct-dt-accent)] [&_[data-slot=selectorIcon]]:!text-[color:var(--ct-dt-accent)]";

const DEFAULT_LABELS = {
  ...BASE_LABELS,
  filters: "Filtros",
  clearFilters: "Limpiar filtros",
  clearAll: "Limpiar",
  rowsPerPage: "Filas por página",
  ariaLabel: "Tabla de datos",
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
  onView,
  rowActions,
  renderActions,
  enableExport = false,
  exportColumns = [],
  exportButtonIcon,
  tableName = "tabla",
  emptyContent = "No se encontraron registros",
  tabs,
  customFilters,
  headerFilters,
  filters,
  onClearFilters,
  filter,
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
  withCard = true,
  customContainerClass = "",
  removeWrapper = false,
  labels,
  server,
}: DataTableProps<T>) {
  const t = { ...DEFAULT_LABELS, ...labels };
  const isServer = Boolean(server);

  // Colores por token (admin o web), compartidos con SortableTable.
  const { vars: styleVars, accent } = getTableColors({
    isAdmin,
    headerColor,
    headerTextColor,
    accentColor: accentColor ?? paginationColor,
    stripeColor,
    borderColor,
    mutedColor,
  });

  const [filtersOpen, setFiltersOpen] = React.useState(false);

  // Grupos de pestañas: cada hijo de `tabs` es un grupo (se aceptan un
  // fragmento, un arreglo o un solo elemento). Entre grupos va una línea.
  const tabGroups = React.Children.toArray(
    React.isValidElement(tabs) && tabs.type === React.Fragment
      ? (tabs.props as { children?: React.ReactNode }).children
      : tabs,
  );

  // "Limpiar todo" solo con `onClearFilters`, o cuando hay un único filtro.
  // Llamar al `onClear` de varios filtros seguidos no es seguro: si el proyecto
  // guarda los filtros en un solo objeto, cada llamada pisa la anterior (todas
  // ven el estado viejo) y solo se limpiaría el último.
  const canClearAll = Boolean(onClearFilters) || activeFilters.length === 1;
  const clearAllFilters = () => {
    if (onClearFilters) onClearFilters();
    else if (activeFilters.length === 1) activeFilters[0].onClear();
  };

  // Filtro único: qué se muestra en el botón.
  const singleAll = filter ? (filter.allValue ?? filter.options[0]?.value) : undefined;
  const singleSelected = filter?.options.find((o) => o.value === filter.value);
  const singleIsActive = Boolean(filter && filter.value !== singleAll);
  const singleButtonLabel = filter
    ? singleIsActive && singleSelected
      ? `${filter.label}: ${singleSelected.label}`
      : filter.label
    : "";

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

  const hasActions = Boolean(renderActions || onView || rowActions);

  // Columna de acciones al final, alineada a la derecha como en los paneles.
  const tableColumns = useMemo(() => {
    if (hasActions) {
      return [...columns, { name: t.actions, uid: "actions", align: "end" as const }];
    }

    return columns;
  }, [columns, hasActions, t.actions]);

  const renderRowActions = (item: T) => (
    <RowActions
      color="var(--ct-dt-accent)"
      isAdmin={isAdmin}
      item={item}
      moreLabel={t.moreActions}
      rowActions={rowActions}
      viewLabel={t.view}
      onView={onView}
    />
  );

  const renderCell = useCallback(
    (item: T, columnKey: React.Key) => {
      if (columnKey === "actions" && hasActions) {
        return renderActions ? renderActions(item) : renderRowActions(item);
      }

      const column = columns.find((col) => col.uid === columnKey);

      if (column?.render) {
        return column.render(item);
      }

      const value = item[columnKey as keyof T];

      // Valores simples con la tipografía del sistema (admin o web). El color
      // se hereda de la fila; `render` queda para contenido propio.
      return (
        <Text color="inherit" isAdmin={isAdmin} variant="label">
          {value === null || value === undefined ? "-" : String(value)}
        </Text>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columns, renderActions, onView, rowActions, isAdmin, t.view, t.moreActions],
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
    searchFields.length > 0 || headerFilters || filters || filter || headerActions || enableExport || onAdd;

  const clientTotalPages = tableFeatures.pages;
  const serverTotalPages = server
    ? Math.max(1, Math.ceil(server.totalRecords / tableFeatures.rowsPerPage))
    : 1;

  return (
    <div
      className={`datatable-citrica-ui ${isAdmin ? "datatable-citrica-ui-admin" : ""} ${withCard ? CARD_CLASS : ""} ${customContainerClass} h-full flex flex-col ${className}`}
      style={styleVars}
    >
      {/* Custom Filters en su propia fila */}
      {/* Pestañas arriba, cerradas con una línea divisoria (variante de los
          paneles Cítrica con filtros rápidos). */}
      {tabs && (
        <>
          {/* Si los grupos no caben en una fila (tablet), pasan a la siguiente
              en vez de desbordar la tarjeta. */}
          <div className="flex w-full min-w-0 flex-shrink-0 flex-col gap-3 pb-4 md:flex-row md:flex-wrap md:items-center">
            {tabGroups.map((group, i) => (
              <React.Fragment key={i}>
                {/* Línea vertical entre grupos (en celular van apilados y no hace falta). */}
                {i > 0 && (
                  <div
                    aria-hidden
                    className="hidden h-9 w-px shrink-0 bg-[color:var(--ct-dt-input-border)] md:block"
                  />
                )}
                {group}
              </React.Fragment>
            ))}
          </div>
          <SectionDivider />
        </>
      )}

      {customFilters && (
        <div className="mb-3 w-full flex-shrink-0">{customFilters}</div>
      )}

      {/* Barra de búsqueda y acciones */}
      {showToolbar && (
        // Solo margen abajo: arriba ya está el relleno de la tarjeta (o la
        // línea de las pestañas), y sumarle más dejaba demasiado aire.
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full pb-3 flex-shrink-0 gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 min-w-0">
            {/* Input de búsqueda */}
            {searchFields.length > 0 && (
              <TableSearch
                accent={accent}
                placeholder={searchPlaceholder || t.search}
                value={searchValue}
                onChange={onSearch}
              />
            )}

            {/* Los filtros (Select o Autocomplete del consumidor) toman el mismo
                estilo del buscador: fondo transparente, borde suave y acento al
                pasar el cursor o escribir. */}
            {headerFilters && (
              <div className={`flex flex-wrap items-center gap-2 ${FILTER_FIELDS_CLASS}`}>
                {headerFilters}
              </div>
            )}

            {/* Botón "Filtros" con su panel. El panel se abre en un portal,
                fuera de la tabla, así que lleva sus propias variables de color. */}
            {filters && (
              <Popover isOpen={filtersOpen} placement="bottom-start" onOpenChange={setFiltersOpen}>
                <PopoverTrigger>
                  <Button
                    className="w-full sm:w-auto !outline-0 aria-expanded:!opacity-100 aria-expanded:!scale-100"
                    color={isAdmin ? "var(--color-admin-secondary-btn-text, #265197)" : "var(--color-secondary-btn-text)"}
                    endContent={
                      <Icon
                        className={`transition-transform duration-200 motion-reduce:transition-none ${filtersOpen ? "rotate-180" : ""}`}
                        name="ChevronDown"
                        size={16}
                      />
                    }
                    isAdmin={isAdmin}
                    label={t.filters}
                    startContent={
                      <span className="relative inline-flex">
                        <Icon name="Filter" size={18} />
                        {activeFilters.length > 0 && (
                          <span
                            aria-label={`${activeFilters.length} activos`}
                            className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[color:var(--ct-dt-accent)] px-1 text-[10px] font-bold leading-none text-white"
                          >
                            {activeFilters.length}
                          </span>
                        )}
                      </span>
                    }
                    variant="secondary"
                  />
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  {/* PopoverContent no pasa `style` a su contenido: las
                      variables de color van en este contenedor. */}
                  <div
                    className={`flex w-[280px] max-w-[calc(100vw-32px)] flex-col items-stretch gap-3 p-4 ${FILTER_FIELDS_CLASS}`}
                    style={styleVars}
                  >
                  {filters}
                  {activeFilters.length > 0 && canClearAll && (
                    <button
                      className="self-start rounded-sm underline-offset-4 hover:underline"
                      type="button"
                      onClick={() => {
                        clearAllFilters();
                        setFiltersOpen(false);
                      }}
                    >
                      <Text color="var(--ct-dt-accent)" isAdmin={isAdmin} variant="label" weight="bold">
                        {t.clearFilters}
                      </Text>
                    </button>
                  )}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Filtro único: el botón abre directo la lista de opciones, con
                una marca en la elegida, y muestra lo elegido ("Estado: Activo"). */}
            {filter && (
              <HeroDropdown
                classNames={{
                  content: isAdmin
                    ? "bg-[var(--color-admin-surface-container-lowest)]"
                    : "bg-[var(--color-surface-container-lowest)]",
                }}
                placement="bottom-start"
              >
                <DropdownTrigger>
                  <Button
                    className="w-full sm:w-auto !outline-0 aria-expanded:!opacity-100 aria-expanded:!scale-100"
                    color={isAdmin ? "var(--color-admin-secondary-btn-text, #265197)" : "var(--color-secondary-btn-text)"}
                    endContent={<Icon name="ChevronDown" size={16} />}
                    isAdmin={isAdmin}
                    label={singleButtonLabel}
                    startContent={<Icon name="Filter" size={18} />}
                    variant="secondary"
                  />
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label={filter.label}
                  selectedKeys={new Set([filter.value])}
                  selectionMode="single"
                  onSelectionChange={(keys) => {
                    const key = Array.from(keys as Set<string>)[0];
                    if (key !== undefined) filter.onChange(String(key));
                  }}
                >
                  {filter.options.map((o) => (
                    <DropdownItem
                      key={o.value}
                      className={
                        // Hover, foco y elegido con el token de superficie
                        // (HeroUI pone su gris por defecto).
                        isAdmin
                          ? "text-[var(--color-admin-on-surface)] data-[hover=true]:!bg-[var(--color-admin-surface-container)] data-[focus=true]:!bg-[var(--color-admin-surface-container)] data-[selected=true]:font-semibold"
                          : "text-[var(--color-on-surface)] data-[hover=true]:!bg-[var(--color-surface-container)] data-[focus=true]:!bg-[var(--color-surface-container)] data-[selected=true]:font-semibold"
                      }
                    >
                      {o.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </HeroDropdown>
            )}
          </div>

          <TableToolbarActions
            addIcon={addButtonIcon || <Icon name="UserPlus" size={16} />}
            addLabel={addButtonText || t.add}
            enableExport={enableExport}
            exportIcon={exportButtonIcon}
            headerActions={headerActions}
            isAdmin={isAdmin}
            labels={t}
            onAdd={onAdd}
            onExportFormat={(key) => exportFeatures.openModal(key)}
          />
        </div>
      )}

      {/* Filtros aplicados, justo debajo de la barra y sin línea de por medio:
          se ve qué está filtrado sin abrir nada, y cada uno se quita aparte. */}
      {/* Se muestran si se pidieron (showFilterIndicators) o si los filtros
          son de la tabla (botón Filtros): ahí no hay otro lugar donde verlos. */}
      {activeFilters.length > 0 && (showFilterIndicators || Boolean(filters)) && (
        <div className="-mt-1 mb-3 flex flex-wrap items-center gap-2">
          {activeFilters.map((filter) => (
            <span
              key={`${filter.label}-${filter.value}`}
              className="inline-flex items-center gap-1 rounded-full bg-[color:var(--ct-dt-chip-bg)] py-1 pl-3 pr-1"
            >
              <Text color={accent} isAdmin={isAdmin} variant="label">
                {filter.label}:
              </Text>
              <Text color={accent} isAdmin={isAdmin} variant="label" weight="bold">
                {filter.value}
              </Text>
              <button
                aria-label={`Quitar filtro ${filter.label}: ${filter.value}`}
                className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-[color:var(--ct-dt-input-border)] motion-reduce:transition-none"
                type="button"
                onClick={filter.onClear}
              >
                <Icon aria-hidden className="text-[color:var(--ct-dt-accent)]" name="X" size={14} />
              </button>
            </span>
          ))}
          {canClearAll && (
            <button
              className="rounded-sm px-1 underline-offset-4 hover:underline"
              type="button"
              onClick={clearAllFilters}
            >
              <Text color={accent} isAdmin={isAdmin} variant="label" weight="bold">
                {t.clearAll}
              </Text>
            </button>
          )}
        </div>
      )}

      {/* Total de registros y filtros permanentes (los aplicados van arriba). */}
      {showFilterIndicators && Boolean(totalRecordsLabel || permanentFilters.length) && (
        <>
          <SectionDivider />
          <div className="flex gap-2 items-center pb-4">
            {totalRecordsLabel && (
              <p>
                <Text color={accent} isAdmin={isAdmin} variant="label">
                  {totalRecordsLabel}
                </Text>
              </p>
            )}
            {totalRecordsLabel && permanentFilters.length > 0 && (
              <Divider className="h-[20px] bg-[color:var(--ct-dt-muted)]" orientation="vertical" />
            )}
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
                <Text color="inherit" isAdmin={isAdmin} variant="label" weight="bold" className="!uppercase">
                  {column.name}
                </Text>
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
