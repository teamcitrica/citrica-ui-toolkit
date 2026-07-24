import type { ReactNode } from "react";

export type { ExportColumn } from "./hooks/useTableExport";

export interface Column<T extends Record<string, any>> {
  name: string;
  uid: string;
  sortable?: boolean;
  align?: "start" | "center" | "end";
  /** Render custom de la celda (chips, botones, acciones…). */
  render?: (item: T) => ReactNode;
}

/** Textos configurables para i18n. Los defaults están en español. */
export interface DataTableLabels {
  search?: string;
  add?: string;
  actions?: string;
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

  // Acciones por fila
  renderActions?: (item: T) => ReactNode;

  // Exportación
  enableExport?: boolean;
  exportColumns?: import("./hooks/useTableExport").ExportColumn[];
  exportButtonIcon?: ReactNode;
  tableName?: string;

  // Estado vacío
  emptyContent?: ReactNode;

  // Slots
  customFilters?: ReactNode;
  /** Filtros que se renderizan EN LÍNEA, al lado del buscador. */
  headerFilters?: ReactNode;
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
