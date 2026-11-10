"use client";
import React, { useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Text } from "../../atoms/Text";
import Icon from "../../atoms/Icon/Icon";
import ExportModal from "../DataTable/ExportModal";
import {
  BASE_LABELS,
  CARD_CLASS,
  TableSearch,
  TableToolbarActions,
  getTableColors,
} from "../DataTable/shared";
import { useTableExport, type ExportColumn } from "../DataTable/hooks/useTableExport";
import RowActions from "../DataTable/RowActions";
import type { DataTableLabels, RowAction } from "../DataTable/types";

// Tabla para reordenar filas arrastrándolas (módulos de un curso, lecciones,
// pasos de un proceso…). Basada en la de Dumbbelldance, con los tokens y la
// tipografía del sistema. No pagina ni ordena por columnas: el orden ES lo que
// el usuario define, así que toda la lista tiene que estar a la vista.

export interface SortableColumn<T> {
  name: string;
  uid: string;
  /** Contenido de la celda. `index` es la posición actual (0, 1, 2…). */
  render: (item: T, index: number) => React.ReactNode;
  /** Ancho CSS de la columna (ej. "30%" o "160px"). */
  width?: string;
}

export interface SortableTableLabels extends DataTableLabels {
  /** Etiqueta accesible del asa de arrastre. `{title}` se reemplaza por `getItemLabel`. */
  dragHandle?: string;
  /** Aviso cuando hay una búsqueda activa y por eso no se puede reordenar. */
  reorderDisabledHint?: string;
  /** Encabezado de la columna de posición. */
  position?: string;
}

export interface SortableTableProps<T extends { id: string | number }> {
  data: T[];
  columns: SortableColumn<T>[];
  /** Recibe la lista completa en el nuevo orden. */
  onReorder: (items: T[]) => void;
  /** Nombre de cada fila para lectores de pantalla ("Mover Módulo 1"). Por defecto, su id. */
  getItemLabel?: (item: T) => string;

  /** Muestra el ojo en cada fila (ver detalle), como en DataTable. */
  onView?: (item: T) => void;
  /** Opciones del menú de tres puntos (Editar, Eliminar…), como en DataTable. */
  rowActions?: RowAction<T>[] | ((item: T) => RowAction<T>[]);

  /** Tema admin (tokens `--color-admin-*`) o web (`--color-*`). Default: web. */
  isAdmin?: boolean;

  searchFields?: (keyof T)[];
  searchPlaceholder?: string;

  onAdd?: () => void;
  addButtonText?: string;
  addButtonIcon?: React.ReactNode;
  headerActions?: React.ReactNode;

  enableExport?: boolean;
  exportColumns?: ExportColumn[];
  tableName?: string;

  emptyContent?: React.ReactNode;
  /** Muestra la columna "#" con la posición de cada fila. Default: true. */
  showPosition?: boolean;

  headerColor?: string;
  headerTextColor?: string;
  accentColor?: string;
  borderColor?: string;
  mutedColor?: string;
  className?: string;
  /** Envuelve la tabla en la tarjeta blanca de los paneles Cítrica. Default: true. */
  withCard?: boolean;

  labels?: SortableTableLabels;
}

const DEFAULT_LABELS = {
  ...BASE_LABELS,
  ariaLabel: "Tabla ordenable",
  dragHandle: "Mover {title}",
  reorderDisabledHint: "Borra la búsqueda para reordenar.",
  position: "#",
};

interface SortableRowProps<T extends { id: string | number }> {
  item: T;
  actions?: React.ReactNode;
  index: number;
  columns: SortableColumn<T>[];
  isAdmin: boolean;
  disabled: boolean;
  handleLabel: string;
  showPosition: boolean;
}

function SortableRow<T extends { id: string | number }>({
  item,
  actions,
  index,
  columns,
  isAdmin,
  disabled,
  handleLabel,
  showPosition,
}: SortableRowProps<T>) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id, disabled });

  return (
    <tr
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        position: isDragging ? "relative" : undefined,
        zIndex: isDragging ? 10 : undefined,
      }}
      className={`border-b border-[color:var(--ct-dt-row-border)] ${
        isDragging
          ? "bg-[color:var(--ct-dt-drag-bg)] shadow-lg"
          : "bg-[color:var(--ct-dt-row-bg)] hover:bg-[color:var(--ct-dt-hover-bg)]"
      }`}
    >
      <td className="w-[44px] px-2 py-3">
        {/* Solo el asa arrastra: así los botones y enlaces de las celdas siguen
            funcionando con un clic normal. Con teclado: Espacio para tomar la
            fila, flechas para moverla, Espacio para soltarla, Escape para
            cancelar. */}
        <button
          ref={setActivatorNodeRef}
          type="button"
          aria-label={handleLabel}
          disabled={disabled}
          className="flex items-center justify-center rounded p-1 transition-colors hover:bg-[color:var(--ct-dt-hover-bg)] enabled:cursor-grab enabled:active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40"
          {...attributes}
          {...listeners}
        >
          <Icon aria-hidden color="var(--ct-dt-subtle)" name="GripVertical" size={16} />
        </button>
      </td>
      {showPosition && (
        <td className="w-[44px] px-2 py-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--ct-dt-hover-bg)]">
            <Text color="var(--ct-dt-accent)" isAdmin={isAdmin} variant="label" weight="bold">
              {index + 1}
            </Text>
          </span>
        </td>
      )}
      {columns.map((col) => (
        <td key={col.uid} className="px-3 py-3" style={col.width ? { width: col.width } : undefined}>
          {col.render(item, index)}
        </td>
      ))}
      {actions !== undefined && <td className="w-[96px] px-3 py-3">{actions}</td>}
    </tr>
  );
}

export function SortableTable<T extends { id: string | number; [key: string]: any }>({
  data,
  columns,
  onReorder,
  getItemLabel,
  onView,
  rowActions,
  isAdmin = false,
  searchFields = [],
  searchPlaceholder,
  onAdd,
  addButtonText,
  addButtonIcon,
  headerActions,
  enableExport = false,
  exportColumns = [],
  tableName = "tabla",
  emptyContent = "No se encontraron elementos",
  showPosition = true,
  headerColor,
  headerTextColor,
  accentColor,
  borderColor,
  mutedColor,
  className = "",
  withCard = true,
  labels,
}: SortableTableProps<T>) {
  const t = { ...DEFAULT_LABELS, ...labels };
  const [search, setSearch] = useState("");
  // Id estable para dnd-kit: sin él numera sus `aria-describedby` con un
  // contador global que da distinto en el servidor y en el navegador (error de
  // hidratación en Next).
  const dndId = React.useId();

  // Mismos colores que DataTable (admin o web).
  const { vars: styleVars, accent } = getTableColors({
    isAdmin,
    headerColor,
    headerTextColor,
    accentColor,
    borderColor,
    mutedColor,
  });

  const searching = search.trim().length > 0 && searchFields.length > 0;

  const visibleItems = useMemo(() => {
    if (!searching) return data;
    const q = search.trim().toLowerCase();
    return data.filter((item) =>
      searchFields.some((field) => {
        const v = item[field];
        return v != null && String(v).toLowerCase().includes(q);
      }),
    );
  }, [data, search, searching, searchFields]);

  const exportFeatures = useTableExport<T>({ rows: visibleItems, tableName });

  // El puntero arrastra después de 5px, para que un clic en el asa no mueva la fila.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const labelOf = (id: string | number | undefined) => {
    const item = data.find((d) => d.id === id);
    return item ? (getItemLabel?.(item) ?? String(item.id)) : "";
  };
  const positionOf = (id: string | number | undefined) => data.findIndex((d) => d.id === id) + 1;

  // Avisos para lectores de pantalla en español (dnd-kit los trae en inglés).
  const announcements: Announcements = {
    onDragStart: ({ active }) => `Tomaste ${labelOf(active.id)}, posición ${positionOf(active.id)} de ${data.length}.`,
    onDragOver: ({ active, over }) =>
      over ? `${labelOf(active.id)} está sobre la posición ${positionOf(over.id)} de ${data.length}.` : `${labelOf(active.id)} fuera de la lista.`,
    onDragEnd: ({ active, over }) =>
      over ? `Soltaste ${labelOf(active.id)} en la posición ${positionOf(over.id)} de ${data.length}.` : `Soltaste ${labelOf(active.id)}.`,
    onDragCancel: ({ active }) => `Cancelado. ${labelOf(active.id)} vuelve a la posición ${positionOf(active.id)}.`,
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = data.findIndex((d) => d.id === active.id);
    const to = data.findIndex((d) => d.id === over.id);
    if (from < 0 || to < 0) return;
    onReorder(arrayMove(data, from, to));
  };

  const hasActions = Boolean(onView || rowActions);
  const showToolbar = searchFields.length > 0 || headerActions || enableExport || onAdd;

  return (
    <div
      className={`sortable-table-citrica-ui ${isAdmin ? "sortable-table-citrica-ui-admin" : ""} ${withCard ? CARD_CLASS : ""} flex h-full min-w-0 max-w-full flex-col ${className}`}
      style={styleVars}
    >
      {showToolbar && (
        <div className="flex w-full flex-col gap-3 pb-3 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            {searchFields.length > 0 && (
              <TableSearch
                accent={accent}
                placeholder={searchPlaceholder || t.search}
                value={search}
                onChange={setSearch}
              />
            )}
            {/* Con una búsqueda activa solo se ve parte de la lista, y mover una
                fila entre filas ocultas daría un orden inesperado: el arrastre
                se desactiva y se explica por qué. */}
            {searching && (
              <Text color="var(--ct-dt-subtle)" isAdmin={isAdmin} variant="label">
                {t.reorderDisabledHint}
              </Text>
            )}
          </div>

          <TableToolbarActions
            addIcon={addButtonIcon || <Icon name="Plus" size={16} />}
            addLabel={addButtonText || t.add}
            enableExport={enableExport}
            headerActions={headerActions}
            isAdmin={isAdmin}
            labels={t}
            onAdd={onAdd}
            onExportFormat={(key) => exportFeatures.openModal(key)}
          />
        </div>
      )}

      {visibleItems.length === 0 ? (
        <div className="rounded-xl border border-[color:var(--ct-dt-row-border)] bg-[color:var(--ct-dt-row-bg)] py-12 text-center">
          <Text color="var(--ct-dt-subtle)" isAdmin={isAdmin} variant="body">
            {emptyContent}
          </Text>
        </div>
      ) : (
        <DndContext
          id={dndId}
          accessibility={{
            announcements,
            screenReaderInstructions: {
              draggable:
                "Para mover una fila, presiona Espacio. Usa las flechas para cambiarla de lugar, Espacio para soltarla o Escape para cancelar.",
            },
          }}
          collisionDetection={closestCenter}
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={visibleItems.map((d) => d.id)} strategy={verticalListSortingStrategy}>
            <div className="overflow-x-auto rounded-xl border border-[color:var(--ct-dt-row-border)]">
              <table aria-label={t.ariaLabel} className="w-full border-collapse">
                <thead>
                  <tr className="bg-[color:var(--ct-dt-header-bg)]">
                    <th className="w-[44px] px-2 py-3">
                      <span className="sr-only">Mover</span>
                    </th>
                    {showPosition && (
                      <th className="w-[44px] px-2 py-3 text-left">
                        <Text color="var(--ct-dt-header-text)" isAdmin={isAdmin} variant="label" weight="bold" className="!uppercase">
                          {t.position}
                        </Text>
                      </th>
                    )}
                    {columns.map((col) => (
                      <th
                        key={col.uid}
                        className="px-3 py-3 text-left"
                        style={col.width ? { width: col.width } : undefined}
                      >
                        <Text color="var(--ct-dt-header-text)" isAdmin={isAdmin} variant="label" weight="bold" className="!uppercase">
                          {col.name}
                        </Text>
                      </th>
                    ))}
                    {hasActions && (
                      <th className="w-[96px] px-3 py-3 text-right">
                        <Text color="var(--ct-dt-header-text)" isAdmin={isAdmin} variant="label" weight="bold" className="!uppercase">
                          {t.actions}
                        </Text>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {visibleItems.map((item) => {
                    // La posición es la de la lista completa, no la del filtro.
                    const index = data.indexOf(item);
                    const title = getItemLabel?.(item) ?? String(item.id);
                    return (
                      <SortableRow
                        key={item.id}
                        actions={
                          hasActions ? (
                            <RowActions
                              color="var(--ct-dt-accent)"
                              isAdmin={isAdmin}
                              item={item}
                              moreLabel={t.moreActions}
                              rowActions={rowActions}
                              viewLabel={t.view}
                              onView={onView}
                            />
                          ) : undefined
                        }
                        columns={columns}
                        disabled={searching}
                        handleLabel={t.dragHandle.replace("{title}", title)}
                        index={index}
                        isAdmin={isAdmin}
                        item={item}
                        showPosition={showPosition}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SortableContext>
        </DndContext>
      )}

      {enableExport && (
        <ExportModal
          exportFormat={exportFeatures.exportFormat}
          fileName={exportFeatures.fileName}
          isAdmin={isAdmin}
          isLoading={exportFeatures.isExporting}
          isOpen={exportFeatures.isModalOpen}
          labels={labels}
          onClose={() => exportFeatures.setIsModalOpen(false)}
          onConfirm={() => exportFeatures.confirmExport(exportColumns)}
          onFileNameChange={exportFeatures.setFileName}
        />
      )}
    </div>
  );
}

export default SortableTable;
