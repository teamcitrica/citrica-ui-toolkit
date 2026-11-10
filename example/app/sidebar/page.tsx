"use client";
import { useEffect, useState } from "react";
import { Sidebar, type MenuItem } from "citrica-ui-toolkit";

const items: MenuItem[] = [
  { title: "Inicio", href: "/inicio", icon: "Home" },
  {
    title: "Usuarios",
    icon: "Users",
    subItems: [
      { title: "Lista", href: "/usuarios" },
      { title: "Roles", href: "/usuarios/roles" },
    ],
  },
  {
    title: "Ventas",
    icon: "ShoppingCart",
    subItems: [
      { title: "Pedidos", href: "/ventas/pedidos" },
      { title: "Facturas", href: "/ventas/facturas" },
      { title: "Reportes", href: "/ventas/reportes" },
    ],
  },
  { title: "Configuración", href: "/config", icon: "Settings" },
];

export default function SidebarDemo() {
  const [active, setActive] = useState("/inicio");

  // Para probar rutas internas: /sidebar?active=/ventas/pedidos/123
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("active");
    if (fromUrl) setActive(fromUrl);
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        items={items}
        activeHref={active}
        activeSubHref={active}
        onItemClick={setActive}
        header={
          <img src="/icon-svg/citrica-logo.svg" alt="Cítrica" className="my-2 h-12 w-auto" />
        }
        collapsedHeader={
          <img src="/icon-svg/citrica-logo-collapsed.svg" alt="Cítrica" className="h-9 w-9 object-contain" />
        }
        organization="Sede Miraflores"
        organizationShort="MIR"
        user={{ name: "Yolanda Castro", role: "admin" }}
      />
      <main className="flex-1 p-8 bg-[#ECF0F9]">
        <p>
          Ruta activa: <code>{active}</code>
        </p>
      </main>
    </div>
  );
}
