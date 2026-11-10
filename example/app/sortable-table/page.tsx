"use client";
import { useState } from "react";
import { SortableTable, type SortableColumn } from "citrica-ui-toolkit";

// Datos de ejemplo genéricos: las etapas de un proyecto, en el orden en que se
// trabajan. Reordenarlas es el caso típico de esta tabla.
interface Etapa {
  id: string;
  nombre: string;
  responsable: string;
  duracion: string;
  completada: boolean;
}

const INICIALES: Etapa[] = [
  { id: "e1", nombre: "Descubrimiento", responsable: "Ana Pérez", duracion: "1 semana", completada: true },
  { id: "e2", nombre: "Arquitectura de información", responsable: "Luis Torres", duracion: "3 días", completada: true },
  { id: "e3", nombre: "Diseño de interfaz", responsable: "María Castro", duracion: "2 semanas", completada: false },
  { id: "e4", nombre: "Desarrollo", responsable: "Jorge García", duracion: "4 semanas", completada: false },
  { id: "e5", nombre: "Pruebas de calidad", responsable: "Lucía Flores", duracion: "1 semana", completada: false },
  { id: "e6", nombre: "Lanzamiento", responsable: "Carlos Vargas", duracion: "2 días", completada: false },
];

export default function SortableTableDemo() {
  const [etapas, setEtapas] = useState(INICIALES);
  const [ultimaAccion, setUltimaAccion] = useState("—");

  const columns: SortableColumn<Etapa>[] = [
    { name: "Etapa", uid: "nombre", render: (e) => <span className="font-medium">{e.nombre}</span> },
    { name: "Responsable", uid: "responsable", width: "180px", render: (e) => e.responsable },
    { name: "Duración", uid: "duracion", width: "140px", render: (e) => e.duracion },
    {
      name: "Estado",
      uid: "completada",
      width: "130px",
      render: (e) => (
        <span style={{ color: e.completada ? "#1F7A4D" : "#6B7280", fontWeight: 600 }}>
          {e.completada ? "Completada" : "Pendiente"}
        </span>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[#ECF0F9] p-6 md:p-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-4">
        <p className="text-sm text-gray-600">
          Orden actual: {etapas.map((e) => e.id).join(" · ")} — Última acción: {ultimaAccion}
        </p>
        <SortableTable<Etapa>
          isAdmin
          data={etapas}
          columns={columns}
          getItemLabel={(e) => e.nombre}
          onView={(e) => setUltimaAccion(`Ver ${e.nombre}`)}
          rowActions={[
            { key: "edit", label: "Editar", onAction: (e) => setUltimaAccion(`Editar ${e.nombre}`) },
            { key: "delete", label: "Eliminar", danger: true, onAction: (e) => setUltimaAccion(`Eliminar ${e.nombre}`) },
          ]}
          onReorder={(nuevo) => {
            setEtapas(nuevo);
            setUltimaAccion("Reordenado");
          }}
          searchFields={["nombre", "responsable"]}
          searchPlaceholder="Buscar etapa o responsable"
          onAdd={() => setUltimaAccion("Agregar etapa")}
          addButtonText="Agregar etapa"
          enableExport
          exportColumns={[
            { header: "Posición", key: "id", format: (_v, row) => String(etapas.indexOf(row) + 1) },
            { header: "Etapa", key: "nombre" },
            { header: "Responsable", key: "responsable" },
            { header: "Duración", key: "duracion" },
            { header: "Estado", key: "completada", format: (v) => (v ? "Completada" : "Pendiente") },
          ]}
          tableName="etapas"
          emptyContent="No hay etapas que coincidan."
        />
      </div>
    </main>
  );
}
