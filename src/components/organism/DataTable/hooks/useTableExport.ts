"use client";
import { useState, useCallback } from "react";

/**
 * Definición de una columna exportable. Genérica: no asume ningún dominio.
 */
export type ExportColumn = {
  header: string;
  key: string;
  format?: (value: any, row?: any) => string;
};

type UseTableExportOptions<T> = {
  /** Filas que se exportarán (ya filtradas por el consumidor). */
  rows: T[];
  /** Nombre base del archivo (sin extensión ni fecha). */
  tableName?: string;
};

/** Formatea la fecha actual como dd-MM-yyyy sin depender de date-fns. */
const todayStamp = () => {
  const d = new Date();
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
};

/** Descarga un Blob como archivo en el navegador. */
const downloadFile = (data: Blob, filename: string) => {
  const url = window.URL.createObjectURL(data);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/** Convierte las filas a objetos planos según las columnas de exportación. */
const buildRows = <T,>(rows: T[], columns: ExportColumn[]) =>
  rows.map((item) => {
    const row: Record<string, any> = {};

    columns.forEach((col) => {
      const value = (item as any)[col.key];

      row[col.header] = col.format ? col.format(value, item) : (value ?? "");
    });

    return row;
  });

/**
 * Hook de exportación de tablas. Las dependencias pesadas (`xlsx`) se cargan de
 * forma perezosa con `import()` sólo al momento de exportar, de modo que las
 * tablas que no exportan no las incluyen en su bundle.
 *
 * `xlsx` es un peer dependency OPCIONAL del toolkit: solo se necesita en el
 * proyecto consumidor si se usa la exportación.
 */
export function useTableExport<T extends Record<string, any>>({
  rows,
  tableName = "tabla",
}: UseTableExportOptions<T>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("");
  const [fileName, setFileName] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const getDefaultFileName = useCallback(
    (name: string = tableName) => `${name}_${todayStamp()}`,
    [tableName],
  );

  const openModal = useCallback(
    (format: string) => {
      setExportFormat(format);
      setFileName(getDefaultFileName());
      setIsModalOpen(true);
    },
    [getDefaultFileName],
  );

  const exportToExcel = useCallback(
    async (name: string, columns: ExportColumn[]) => {
      // xlsx es peer OPCIONAL: se resuelve en runtime en el proyecto consumidor.
      // @ts-ignore - el tipo puede no existir en el toolkit
      const XLSX = await import("xlsx");
      const ws = XLSX.utils.json_to_sheet(buildRows(rows, columns));
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "Datos");
      const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

      downloadFile(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `${name}.xlsx`,
      );
    },
    [rows],
  );

  const exportToCSV = useCallback(
    async (name: string, columns: ExportColumn[]) => {
      // @ts-ignore - xlsx es peer opcional
      const XLSX = await import("xlsx");
      const ws = XLSX.utils.json_to_sheet(buildRows(rows, columns));
      const csv = XLSX.utils.sheet_to_csv(ws);

      downloadFile(new Blob([csv], { type: "text/csv" }), `${name}.csv`);
    },
    [rows],
  );

  /**
   * Confirma la exportación. Si se pasa `onExport` (por ejemplo para
   * paginación de servidor) se delega en el consumidor; de lo contrario se
   * exporta el conjunto de filas local en el formato seleccionado.
   */
  const confirmExport = useCallback(
    async (
      columns: ExportColumn[],
      onExport?: (format: string, fileName: string) => Promise<void>,
    ) => {
      if (!fileName.trim()) return;
      setIsExporting(true);
      try {
        if (onExport) {
          await onExport(exportFormat, fileName);
        } else if (exportFormat === "excel") {
          await exportToExcel(fileName, columns);
        } else if (exportFormat === "csv") {
          await exportToCSV(fileName, columns);
        }
        setIsModalOpen(false);
      } finally {
        setIsExporting(false);
      }
    },
    [exportFormat, fileName, exportToExcel, exportToCSV],
  );

  return {
    isModalOpen,
    exportFormat,
    fileName,
    isExporting,
    setFileName,
    setIsModalOpen,
    getDefaultFileName,
    openModal,
    confirmExport,
  };
}
