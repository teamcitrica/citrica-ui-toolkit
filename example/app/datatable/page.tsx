"use client";
import { useMemo, useState } from "react";
import {
  Autocomplete,
  Button,
  DataTable,
  FilterButtonGroup,
  type Column,
  type ExportColumn,
} from "citrica-ui-toolkit";

type Estado = "activo" | "pendiente" | "inactivo";

interface Contacto {
  id: number;
  nombre: string;
  correo: string;
  empresa: string;
  estado: Estado;
  creado: string; // ISO
  monto: number;
}

const NOMBRES = ["Ana", "Luis", "María", "Jorge", "Lucía", "Carlos", "Sofía", "Diego", "Valeria", "Andrés"];
const APELLIDOS = ["Pérez", "García", "Rodríguez", "Torres", "Flores", "Ramírez", "Castro", "Vargas"];
const EMPRESAS = ["Cítrica", "Akita", "Lienzo", "Galiz", "Impulso", "Parkano"];
const ESTADOS: Estado[] = ["activo", "pendiente", "inactivo"];

// 47 filas: no es múltiplo de la paginación, para ver la última página incompleta.
const DATA: Contacto[] = Array.from({ length: 47 }, (_, i) => {
  const nombre = `${NOMBRES[i % NOMBRES.length]} ${APELLIDOS[(i * 3) % APELLIDOS.length]}`;
  return {
    id: i + 1,
    nombre,
    correo: `${nombre.split(" ")[0].toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")}${i + 1}@correo.com`,
    empresa: EMPRESAS[(i * 7) % EMPRESAS.length],
    estado: ESTADOS[(i * 5) % ESTADOS.length],
    creado: new Date(2026, (i * 2) % 12, ((i * 11) % 27) + 1).toISOString(),
    monto: ((i * 7919) % 50000) / 10,
  };
});

const fecha = (iso: string) => new Date(iso).toLocaleDateString("es-PE");
const soles = (n: number) => n.toLocaleString("es-PE", { style: "currency", currency: "PEN" });

const COLOR_ESTADO: Record<Estado, string> = {
  activo: "#1F7A4D",
  pendiente: "#9A6700",
  inactivo: "#6B7280",
};

const columns: Column<Contacto>[] = [
  { name: "ID", uid: "id", sortable: true },
  { name: "Nombre", uid: "nombre", sortable: true },
  { name: "Correo", uid: "correo" },
  { name: "Empresa", uid: "empresa", sortable: true },
  {
    name: "Estado",
    uid: "estado",
    sortable: true,
    render: (c) => (
      <span style={{ color: COLOR_ESTADO[c.estado], fontWeight: 600, textTransform: "capitalize" }}>
        {c.estado}
      </span>
    ),
  },
  { name: "Creado", uid: "creado", sortable: true, render: (c) => fecha(c.creado) },
  { name: "Monto", uid: "monto", sortable: true, align: "end", render: (c) => soles(c.monto) },
];

const exportColumns: ExportColumn[] = [
  { header: "ID", key: "id" },
  { header: "Nombre", key: "nombre" },
  { header: "Correo", key: "correo" },
  { header: "Empresa", key: "empresa" },
  { header: "Estado", key: "estado" },
  { header: "Creado", key: "creado", format: (v) => fecha(v) },
  { header: "Monto", key: "monto", format: (v) => soles(v) },
];

export default function DataTableDemo() {
  const [isAdmin, setIsAdmin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [vacia, setVacia] = useState(false);
  const [conTabs, setConTabs] = useState(true);
  const [filtroUnico, setFiltroUnico] = useState(false);
  const [empresa, setEmpresa] = useState("todas");
  const [monto, setMonto] = useState("todos");
  const [estado, setEstado] = useState<string>("todos");
  const [ultimaAccion, setUltimaAccion] = useState("—");

  // Filtro externo (fuera de la tabla), como haría una página real.
  const filas = useMemo(() => {
    if (vacia) return [];
    return DATA.filter(
      (c) =>
        (estado === "todos" || c.estado === estado) &&
        (empresa === "todas" || c.empresa === empresa) &&
        (monto === "todos" || (monto === "alto" ? c.monto > 2000 : c.monto <= 2000)),
    );
  }, [estado, empresa, monto, vacia]);

  return (
    <main className="min-h-screen bg-[#ECF0F9] p-6 md:p-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button isAdmin variant="secondary" size="sm" label={isAdmin ? "Tema: admin" : "Tema: web"} onPress={() => setIsAdmin((v) => !v)} />
          <Button
            isAdmin
            variant="secondary"
            size="sm"
            label={isLoading ? "Quitar carga" : "Simular carga"}
            onPress={() => setIsLoading((v) => !v)}
          />
          <Button isAdmin variant="secondary" size="sm" label={vacia ? "Con datos" : "Sin datos"} onPress={() => setVacia((v) => !v)} />
          <Button isAdmin variant="secondary" size="sm" label={conTabs ? "Quitar pestañas" : "Con pestañas"} onPress={() => setConTabs((v) => !v)} />
          <Button isAdmin variant="secondary" size="sm" label={filtroUnico ? "Filtro múltiple" : "Filtro único"} onPress={() => { setFiltroUnico((v) => !v); setEmpresa("todas"); }} />
          <span className="text-sm text-gray-600">Última acción: {ultimaAccion}</span>
        </div>

        <DataTable<Contacto>
          isAdmin={isAdmin}
          tabs={
            conTabs ? (
              <>
                <FilterButtonGroup
                  isAdmin={isAdmin}
                  ariaLabel="Filtrar por estado"
                  buttons={[
                    { value: "todos", label: "Todos" },
                    { value: "activo", label: "Activos" },
                    { value: "pendiente", label: "Pendientes" },
                  ]}
                  selectedValue={estado === "inactivo" ? "todos" : estado}
                  onValueChange={setEstado}
                />
                <FilterButtonGroup
                  isAdmin={isAdmin}
                  ariaLabel="Filtrar por empresa"
                  buttons={[{ value: "todas", label: "Todas" }, ...["Cítrica", "Akita", "Lienzo"].map((e) => ({ value: e, label: e }))]}
                  selectedValue={empresa}
                  onValueChange={setEmpresa}
                />
                <FilterButtonGroup
                  isAdmin={isAdmin}
                  ariaLabel="Filtrar por monto"
                  buttons={[
                    { value: "todos", label: "Todos" },
                    { value: "alto", label: "Más de S/ 2,000" },
                    { value: "bajo", label: "Hasta S/ 2,000" },
                  ]}
                  selectedValue={monto}
                  onValueChange={setMonto}
                />
              </>
            ) : undefined
          }
          data={filas}
          columns={columns}
          getRowKey={(c) => c.id}
          isLoading={isLoading}
          searchFields={["nombre", "correo", "empresa"]}
          searchPlaceholder="Buscar por nombre, correo o empresa"
          defaultSortColumn="id"
          itemsPerPage={10}
          showRowsPerPageSelector
          rowsPerPageOptions={[5, 10, 20, 50]}
          onAdd={() => setUltimaAccion("Agregar contacto")}
          addButtonText="Agregar contacto"
          onView={(c) => setUltimaAccion(`Ver #${c.id}`)}
          rowActions={(c) => [
            { key: "edit", label: "Editar", onAction: () => setUltimaAccion(`Editar #${c.id}`) },
            {
              key: "activate",
              label: "Activar",
              isHidden: () => c.estado === "activo",
              onAction: () => setUltimaAccion(`Activar #${c.id}`),
            },
            { key: "delete", label: "Eliminar", danger: true, onAction: () => setUltimaAccion(`Eliminar #${c.id}`) },
          ]}
          enableExport
          exportColumns={exportColumns}
          tableName="contactos"
          filter={
            filtroUnico
              ? {
                  label: "Estado",
                  value: estado,
                  onChange: setEstado,
                  options: [
                    { value: "todos", label: "Todos" },
                    { value: "activo", label: "Activo" },
                    { value: "pendiente", label: "Pendiente" },
                    { value: "inactivo", label: "Inactivo" },
                  ],
                }
              : undefined
          }
          filters={
            filtroUnico ? undefined : (
            <>
              <Autocomplete
                isAdmin={isAdmin}
                variant="bordered"
                label="Estado"
                labelPlacement="outside"
                placeholder="Todos los estados"
                isClearable={false}
                selectedKey={estado}
                onSelectionChange={(key) => setEstado(key ?? "todos")}
                options={[
                  { value: "todos", label: "Todos" },
                  { value: "activo", label: "Activo" },
                  { value: "pendiente", label: "Pendiente" },
                  { value: "inactivo", label: "Inactivo" },
                ]}
              />
              <Autocomplete
                isAdmin={isAdmin}
                variant="bordered"
                label="Empresa"
                labelPlacement="outside"
                placeholder="Todas las empresas"
                isClearable={false}
                selectedKey={empresa}
                onSelectionChange={(key) => setEmpresa(key ?? "todas")}
                options={[{ value: "todas", label: "Todas" }, ...EMPRESAS.map((e) => ({ value: e, label: e }))]}
              />
            </>
            )
          }
          onClearFilters={() => {
            setEstado("todos");
            setEmpresa("todas");
          }}
          showFilterIndicators
          activeFilters={filtroUnico ? [] : [
            ...(estado !== "todos" ? [{ label: "Estado", value: estado.charAt(0).toUpperCase() + estado.slice(1), onClear: () => setEstado("todos") }] : []),
            ...(empresa !== "todas" ? [{ label: "Empresa", value: empresa, onClear: () => setEmpresa("todas") }] : []),
          ]}
          emptyContent="No hay contactos para mostrar."
        />
      </div>
    </main>
  );
}
