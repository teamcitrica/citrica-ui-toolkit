"use client";
import type { SortDescriptor } from "@heroui/table";

import { useState, useCallback, useMemo } from "react";

// Re-exportado por compatibilidad: el tipo vive en useTableExport.
export type { ExportColumn } from "./useTableExport";

type UseTableFeaturesOptions<T> = {
  data: T[];
  initialRowsPerPage?: number;
  searchFields?: (keyof T)[];
  defaultSortColumn?: keyof T;
  defaultSortDirection?: "ascending" | "descending";
};

/**
 * Hook genérico de datos de tabla: búsqueda, ordenamiento y paginación de
 * lado del cliente. No conoce ningún concepto de dominio ni de exportación.
 */
export function useTableFeatures<T extends Record<string, any>>({
  data,
  initialRowsPerPage = 15,
  searchFields = [],
  defaultSortColumn,
  defaultSortDirection = "ascending",
}: UseTableFeaturesOptions<T>) {
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: defaultSortColumn as string,
    direction: defaultSortDirection,
  });

  const hasSearchFilter = Boolean(filterValue);

  // Búsqueda global sobre los campos indicados.
  const filteredItems = useMemo(() => {
    if (!data) return [];
    if (!hasSearchFilter || searchFields.length === 0) return [...data];

    const searchLower = filterValue.toLowerCase();

    return data.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];

        if (value === null || value === undefined) return false;

        return String(value).toLowerCase().includes(searchLower);
      }),
    );
  }, [data, filterValue, hasSearchFilter, searchFields]);

  // Ordenamiento por la columna activa.
  const sortedItems = useMemo(() => {
    if (!sortDescriptor.column) return filteredItems;

    return [...filteredItems].sort((a: T, b: T) => {
      const column = sortDescriptor.column as keyof T;
      let first = a[column];
      let second = b[column];

      if (first === null || first === undefined) first = "" as any;
      if (second === null || second === undefined) second = "" as any;

      if (typeof first === "string" && typeof second === "string") {
        const cmp = first.localeCompare(second);

        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  // Paginación.
  const pages = Math.max(1, Math.ceil(sortedItems.length / rowsPerPage));

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;

    return sortedItems.slice(start, start + rowsPerPage);
  }, [page, sortedItems, rowsPerPage]);

  const onSearchChange = useCallback((value?: string) => {
    setFilterValue(value ?? "");
    setPage(1);
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const onRowsPerPageChange = useCallback((size: number) => {
    setRowsPerPage(size);
    setPage(1);
  }, []);

  return {
    // Estados
    filterValue,
    page,
    rowsPerPage,
    sortDescriptor,

    // Datos procesados
    filteredItems,
    sortedItems,
    paginatedItems,
    pages,
    hasSearchFilter,

    // Setters
    setFilterValue,
    setPage,
    setRowsPerPage,
    setSortDescriptor,

    // Handlers
    onSearchChange,
    onClear,
    onRowsPerPageChange,
  };
}
