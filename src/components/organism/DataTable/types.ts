import type { ReactNode } from "react";
import type { IconName } from "../../atoms/Icon/Icon";

export type { ExportColumn } from "./hooks/useTableExport";

export interface Column<T extends Record<string, any>> {
  name: string;
  uid: string;
  sortable?: boolean;
  align?: "start" | "center" | "end";
  /** Render custom de la celda (chips, botones, acciones…). */
  render?: (item: T) => ReactNode;
}

/** Una opción del menú de tres puntos de cada fila. */
export interface RowAction<T> {
  key: string;
  label: ReactNode;
  /** Ícono lucide opcional al inicio. */
  icon?: IconName;
  /** En rojo, para acciones destructivas como "Eliminar". */
  danger?: boolean;
  onAction: (item: T) => void;
  /** Oculta la opción en filas concretas (ej. "Activar" en una fila ya activa). */
  isHidden?: (item: T) => boolean;
}

/**
 * Filtro de una sola opción: un botón con embudo que abre la lista de opciones
 * y muestra la elegida ("Estado: Activo").
 */
export interface DataTableSingleFilter {
  /** Nombre del filtro (ej. "Estado"). */
  label: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  /** Valor que significa "sin filtrar" (ej. "todos"). Default: el de la primera opción. */
  allValue?: string;
}

/** Textos configurables para i18n. Los defaults están en español. */
export interface DataTableLabels {
  search?: string;
  add?: string;
  actions?: string;
  /** Etiqueta accesible del botón del ojo. */
  view?: string;
  /** Etiqueta accesible del botón de tres puntos. */
  moreActions?: string;
  /** Texto del botón que abre el panel de filtros. */
  filters?: string;
  /** Enlace para quitar todos los filtros, al pie del panel. */
  clearFilters?: string;
  /** Enlace para quitar todos los filtros, junto a los filtros aplicados. */
  clearAll?: string;
  export?: string;
  rowsPerPage?: string;
  ariaLabel?: string;
  exportAriaLabel?: string;
  // Items del menú de exportación
  excelItem?: string;
  csvItem?: string;
  // Indicador de filtro permanente
  activeFilterLabel?: string;
  // ExportModal
  exportTitle?: string;
  exportFormatLabel?: string;
  exportFileNameLabel?: string;
  exportFileNamePlaceholder?: string;
  exportFileNameHint?: string;
  exportCancel?: string;
  exportConfirm?: string;
  exportConfirming?: string;
}

/**
 * Configuración de modo servidor. Si se provee este objeto, la tabla delega
 * búsqueda, orden, paginación y exportación en el consumidor.
 */
export interface DataTableServerConfig {
  totalRecords: number;
  page: number;
  onPageChange: (page: number) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSortChange?: (
    column: string,
    direction: "ascending" | "descending",
  ) => void;
  onExport?: (format: string, fileName: string) => Promise<void>;
}

export interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  getRowKey: (item: T) => string | number;
  isLoading?: boolean;

  /** Tema admin (tokens `--color-admin-*`) o web (`--color-*`). Default: web. */
  isAdmin?: boolean;

  // Búsqueda / orden
  searchFields?: (keyof T)[];
  searchPlaceholder?: string;
  defaultSortColumn?: keyof T;
  defaultSortDirection?: "ascending" | "descending";

  // Paginación cliente
  itemsPerPage?: number;
  showRowsPerPageSelector?: boolean;
  rowsPerPageOptions?: number[];
  onPageSizeChange?: (size: number) => void;

  // Acción de agregar
  onAdd?: () => void;
  addButtonText?: string;
  addButtonIcon?: ReactNode;

  // Acciones por fila. Patrón de los paneles Cítrica: un ojo para ver el
  // detalle y tres puntos con el resto (Editar, Eliminar…).
  /** Muestra el ojo en cada fila. */
  onView?: (item: T) => void;
  /** Opciones del menú de tres puntos. Puede depender de la fila. */
  rowActions?: RowAction<T>[] | ((item: T) => RowAction<T>[]);
  /** Contenido propio de la columna de acciones. Si se pasa, reemplaza al ojo y los tres puntos. */
  renderActions?: (item: T) => ReactNode;

  // Exportación
  enableExport?: boolean;
  exportColumns?: import("./hooks/useTableExport").ExportColumn[];
  exportButtonIcon?: ReactNode;
  tableName?: string;

  // Estado vacío
  emptyContent?: ReactNode;

  // Slots
  /**
   * Fila de pestañas o filtros rápidos arriba de todo (ej. uno o más
   * FilterButtonGroup). Con varios grupos (en un fragmento o un arreglo), entre
   * cada uno va una línea vertical. Debajo de la fila, una línea divisoria y
   * luego la barra de búsqueda, como en los paneles Cítrica.
   */
  tabs?: ReactNode;
  customFilters?: ReactNode;
  /** Filtros que se renderizan EN LÍNEA, al lado del buscador. */
  headerFilters?: ReactNode;
  /**
   * Filtros dentro de un panel que se abre con el botón "Filtros" (embudo),
   * al lado del buscador. Útil cuando hay varios filtros y no caben en línea.
   * El botón muestra cuántos hay activos (según `activeFilters`).
   */
  filters?: ReactNode;
  /**
   * Quita todos los filtros: se usa en "Limpiar filtros" (panel) y en "Limpiar"
   * (junto a los filtros aplicados). Sin esta prop, esos enlaces solo aparecen
   * cuando hay un único filtro activo (cada chip se sigue quitando con su ×).
   */
  onClearFilters?: () => void;
  /** Filtro de una sola opción, con un botón que abre la lista. Ver `DataTableSingleFilter`. */
  filter?: DataTableSingleFilter;
  headerActions?: ReactNode;

  // Indicadores de filtros
  showFilterIndicators?: boolean;
  totalRecordsLabel?: string;
  activeFilters?: Array<{ label: string; value: string; onClear: () => void }>;
  permanentFilters?: Array<{ column: string; value: string }>;

  // Estilo / theming (overrides; por defecto salen de tokens según isAdmin)
  headerColor?: string;
  headerTextColor?: string;
  accentColor?: string;
  stripeColor?: string;
  borderColor?: string;
  mutedColor?: string;
  /** @deprecated usar `accentColor`. */
  paginationColor?: string;
  className?: string;
  /** Envuelve la tabla en la tarjeta blanca de los paneles Cítrica. Default: true. */
  withCard?: boolean;
  customContainerClass?: string;
  removeWrapper?: boolean;

  // i18n
  labels?: DataTableLabels;

  // Modo servidor (opcional). Su presencia activa la paginación de servidor.
  server?: DataTableServerConfig;
}

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportFormat: string;
  fileName: string;
  onFileNameChange: (value: string) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  isAdmin?: boolean;
  labels?: DataTableLabels;
}
