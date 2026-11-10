"use client";
import { useRef, useState } from "react";
import {
  AdminNavbar,
  Sidebar,
  Button,
  type AdminNotificationGroup,
  type AdminNotificationItem,
  type MenuItem,
} from "citrica-ui-toolkit";

const items: MenuItem[] = [
  { title: "Inicio", href: "/inicio", icon: "Home" },
  {
    title: "CRM",
    icon: "Users",
    subItems: [
      { title: "Contactos", href: "/crm/contactos" },
      { title: "Leads", href: "/crm/leads" },
    ],
  },
  {
    title: "Agenda",
    icon: "Calendar",
    subItems: [
      { title: "Calendario", href: "/agenda/calendario" },
      { title: "Recordatorios", href: "/agenda/recordatorios" },
    ],
  },
  { title: "Configuración", href: "/config", icon: "Settings" },
];

// Avisos agrupados por tipo, con un ícono por grupo.
const GRUPOS: AdminNotificationGroup[] = [
  {
    key: "hoy",
    title: "Hoy",
    icon: "CalendarClock",
    items: [
      { id: "r1", title: "Reunión con Akita", detail: "10:30 · Google Meet" },
      { id: "r2", title: "Demo con Lienzo", detail: "16:00 · Oficina" },
    ],
  },
  {
    key: "pagos",
    title: "Pagos por verificar",
    icon: "BadgeDollarSign",
    items: [
      {
        id: "p1",
        title: "Galiz reportó un pago de S/ 1,200",
        detail: "Ver servicios contratados",
      },
    ],
  },
  {
    key: "leads",
    title: "Leads nuevos",
    icon: "UserPlus",
    items: [
      { id: "l1", title: "5 leads sin atender", detail: "Ver en CRM → Leads" },
    ],
  },
];

// Lista simple con leídos / no leídos y hora.
const LISTA_INICIAL: AdminNotificationItem[] = [
  {
    id: "n1",
    title: "Nuevo comentario en el proyecto",
    detail: "Akita · Diseño de interfaz",
    time: "Hace 5 min",
    isRead: false,
  },
  {
    id: "n2",
    title: "Contrato firmado",
    detail: "Lienzo · Plan anual",
    time: "Hace 2 h",
    isRead: false,
  },
  {
    id: "n3",
    title: "Factura emitida",
    detail: "Galiz · noviembre",
    time: "Ayer",
    isRead: true,
  },
];

// Así armaría un proyecto su app/admin/layout.tsx: el Sidebar y el AdminNavbar
// de la librería, juntos con su propia estructura de página.
export default function AdminNavbarDemo() {
  const [active, setActive] = useState("/inicio");
  const [estilo, setEstilo] = useState<"grupos" | "lista">("grupos");
  const [lista, setLista] = useState(LISTA_INICIAL);
  const [conAvisos, setConAvisos] = useState(true);
  const [ultimaAccion, setUltimaAccion] = useState("—");
  // El ☰ del navbar abre el menú del sidebar en celular.
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex min-h-screen bg-[#ECF0F9]">
      <Sidebar
        items={items}
        activeHref={active}
        activeSubHref={active}
        onItemClick={setActive}
        header={
          <img
            src="/icon-svg/citrica-logo.svg"
            alt="Cítrica"
            className="my-2 h-12 w-auto"
          />
        }
        collapsedHeader={
          <img
            src="/icon-svg/citrica-logo-collapsed.svg"
            alt="Cítrica"
            className="h-9 w-9 object-contain"
          />
        }
        organization="Sede Miraflores"
        organizationShort="MIR"
        mobileOpen={menuOpen}
        onMobileOpenChange={setMenuOpen}
        mobileReturnFocusRef={menuButtonRef}
      />
      <div className="flex min-w-0 flex-1 flex-col md:h-[100svh]">
        <AdminNavbar
          onMenuClick={() => setMenuOpen(true)}
          menuOpen={menuOpen}
          menuButtonRef={menuButtonRef}
          mobileLogo={
            <img
              src="/icon-svg/citrica-logo-collapsed.svg"
              alt="Cítrica"
              className="h-7 w-7 object-contain"
            />
          }
          user={{
            name: "Yolanda Castro",
            role: "admin",
            menu: [
              {
                key: "perfil",
                label: "Mi perfil",
                icon: "User",
                onAction: () => setUltimaAccion("Mi perfil"),
              },
              {
                key: "logout",
                label: "Cerrar sesión",
                icon: "LogOut",
                danger: true,
                onAction: () => setUltimaAccion("Cerrar sesión"),
              },
            ],
          }}
          notifications={
            !conAvisos
              ? { groups: [] }
              : estilo === "grupos"
                ? {
                    groups: GRUPOS,
                    onItemClick: (a) => setUltimaAccion(`Aviso: ${a.id}`),
                  }
                : {
                    items: lista,
                    onItemClick: (a) => {
                      setLista((l) =>
                        l.map((n) =>
                          n.id === a.id ? { ...n, isRead: true } : n,
                        ),
                      );
                      setUltimaAccion(`Aviso: ${a.id}`);
                    },
                    onMarkAllRead: () =>
                      setLista((l) => l.map((n) => ({ ...n, isRead: true }))),
                  }
          }
          actions={
            <button
              type="button"
              className="h-10 rounded-full border border-[#D5DDEB] bg-[#F0F3FA] px-3 text-sm font-semibold text-[#265197]"
            >
              ES
            </button>
          }
        />
        {/* El contenido con su propio scroll en escritorio, como en citrica-web. */}
        <main className="min-w-0 flex-1 px-4 pb-10 md:overflow-y-auto md:px-6">
          <div className="flex flex-col gap-4 pt-2">
            <h1 className="text-2xl font-bold text-[#265197]">
              Ruta activa: {active}
            </h1>
            <div className="flex flex-wrap gap-2">
              <Button
                isAdmin
                variant="secondary"
                size="sm"
                label={
                  estilo === "grupos" ? "Avisos en lista" : "Avisos agrupados"
                }
                onPress={() =>
                  setEstilo((e) => (e === "grupos" ? "lista" : "grupos"))
                }
              />
              <Button
                isAdmin
                variant="secondary"
                size="sm"
                label={conAvisos ? "Sin avisos" : "Con avisos"}
                onPress={() => setConAvisos((v) => !v)}
              />
              <span className="self-center text-sm text-gray-600">
                Última acción: {ultimaAccion}
              </span>
            </div>
            {/* Contenido alto para probar el scroll de la columna */}
            {Array.from({ length: 2 }, (_, i) => (
              <div
                key={i}
                className="rounded-[20px] bg-white p-4 shadow-[0px_1px_2px_0px_#0000004D]"
              >
                <p className="text-sm text-gray-700">
                  Bloque de contenido {i + 1}
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
