"use client";
import React from 'react';
import { Button } from '../../atoms/Button';
import { Icon, IconName } from '../../atoms/Icon';
import type { SidebarProps, MenuItem } from './types';

// Tokens del sidebar como CSS vars, con fallback a los tokens admin del sistema.
// Centralizar aquí evita los grises hardcodeados y el bug de "texto blanco sobre
// fondo blanco": el color del texto SIEMPRE contrasta con el fondo del panel.
// Se pueden sobreescribir por el consumidor vía `style` en el contenedor.
const sidebarVars = {
  "--sb-bg": "var(--color-admin-surface-container-lowest, #ffffff)",
  "--sb-fg": "var(--color-admin-on-surface, #1d222b)",
  "--sb-hover-bg": "var(--color-admin-surface-container, #eaecf1)",
  "--sb-active-bg": "var(--color-admin-primary-container, #d4deed)",
  "--sb-active-fg": "var(--color-admin-on-primary-container, #16305a)",
  "--sb-accent": "var(--color-admin-primary, #265197)",
  "--sb-border": "var(--color-admin-outline, #b9c2d0)",
} as React.CSSProperties;

// Base común para una fila del nav: usa `Button unstyled`, así que aquí
// neutralizamos el recipe de HeroUI (inline-flex/justify-center/min-w/h/px/
// rounded/opacity-hover) vía twMerge — sin `!important`.
// `bg-transparent` neutraliza el `bg-default` (gris) del recipe de HeroUI en
// reposo; el activo y el hover lo sobreescriben porque van después (twMerge).
const rowBase =
  "group flex h-auto min-w-0 items-center gap-3 rounded-lg bg-transparent px-3 py-2 text-left transition-colors duration-200 data-[hover=true]:opacity-100 motion-reduce:transition-none";

// Normaliza un href (ignora el hash) para comparar de forma estable, sin
// depender de window ni romperse con rutas relativas o con query string.
const normalizeHref = (href?: string) => (href ?? "").split("#")[0];
const sameHref = (a?: string, b?: string) =>
  !!a && !!b && normalizeHref(a) === normalizeHref(b);

interface AccordionItemProps {
  item: MenuItem;
  isOpen: boolean;
  onToggle: () => void;
  activeSubHref?: string;
  onNavigate: (href: string) => void;
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
  activeSubHref,
  onNavigate,
}: AccordionItemProps) {
  const panelId = `sb-panel-${item.title.replace(/\s+/g, "-").toLowerCase()}`;
  const hasActiveChild = (item.subItems ?? []).some((s) =>
    sameHref(activeSubHref, s.href),
  );

  return (
    <div>
      <Button
        disableRipple
        fullWidth
        unstyled
        aria-controls={panelId}
        aria-expanded={isOpen}
        className={`${rowBase} justify-between ${
          hasActiveChild ? "text-[var(--sb-active-fg)]" : "text-[var(--sb-fg)]"
        } hover:bg-[var(--sb-hover-bg)]`}
        onPress={onToggle}
      >
        <span className="flex min-w-0 items-center gap-3">
          {item.icon && (
            <Icon
              aria-hidden
              name={item.icon as IconName}
              size={20}
              strokeWidth={2}
            />
          )}
          <span
            className={`truncate text-[14px] ${hasActiveChild ? "font-semibold" : "font-medium"}`}
          >
            {item.title}
          </span>
        </span>
        <Icon
          aria-hidden
          className={`shrink-0 transition-transform duration-200 motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
          name="ChevronDown"
          size={16}
        />
      </Button>

      {/* Colapsa con la utilidad `hidden` (display:none), NO con el atributo
          HTML `hidden` — este último lo pisa la clase `flex` (misma
          especificidad, gana la de autor). display:none también saca los
          sub-ítems del orden de tabulación cuando está cerrado. */}
      <ul
        className={isOpen ? "mt-1 flex flex-col gap-1 pl-4" : "hidden"}
        id={panelId}
      >
        {(item.subItems ?? []).map((subItem) => {
          const isActive = sameHref(activeSubHref, subItem.href);

          return (
            <li key={subItem.title}>
              <Button
                disableRipple
                fullWidth
                unstyled
                aria-current={isActive ? "page" : undefined}
                className={`${rowBase} justify-start text-[13px] ${
                  isActive
                    ? "bg-[var(--sb-active-bg)] font-semibold text-[var(--sb-active-fg)]"
                    : "font-normal text-[var(--sb-fg)] hover:bg-[var(--sb-hover-bg)]"
                }`}
                onPress={() => onNavigate(subItem.href)}
              >
                <span
                  aria-hidden
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${isActive ? "bg-[var(--sb-accent)]" : "bg-current opacity-40"}`}
                />
                <span className="truncate">{subItem.title}</span>
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeHref,
  activeSubHref,
  onItemClick,
  className = "",
  header,
  ariaLabel = "Navegación principal",
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({});
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const openButtonRef = React.useRef<HTMLButtonElement>(null);

  const navigate = (href?: string) => {
    if (href && onItemClick) onItemClick(href);
    setIsOpen(false);
  };

  // Drawer móvil: Escape cierra, se bloquea el scroll del body y se gestiona el
  // foco (al abrir → botón cerrar; al cerrar → botón que lo abrió).
  React.useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      openButtonRef.current?.focus();
    };
  }, [isOpen]);

  const NavItems = () => (
    <nav
      aria-label={ariaLabel}
      className="flex h-full w-full flex-col gap-1 overflow-y-auto bg-[var(--sb-bg)] px-2 py-4 text-[var(--sb-fg)]"
    >
      {header ? <div className="mb-2 px-1">{header}</div> : null}
      {items.map((item) => {
        const hasSub = !!item.subItems && item.subItems.length > 0;

        if (hasSub) {
          const childActive = item.subItems!.some((s) =>
            sameHref(activeSubHref, s.href),
          );
          // Estado efectivo: lo que el usuario alternó, o abierto si un hijo
          // está activo. El toggle invierte ese estado efectivo (un solo clic
          // siempre alterna respecto a lo que se ve).
          const isItemOpen = openItems[item.title] ?? childActive;

          return (
            <AccordionItem
              key={item.title}
              activeSubHref={activeSubHref}
              isOpen={isItemOpen}
              item={item}
              onNavigate={navigate}
              onToggle={() =>
                setOpenItems((prev) => ({
                  ...prev,
                  [item.title]: !isItemOpen,
                }))
              }
            />
          );
        }

        const isActive = sameHref(activeHref, item.href);

        return (
          <Button
            key={item.title}
            disableRipple
            fullWidth
            unstyled
            aria-current={isActive ? "page" : undefined}
            className={`${rowBase} justify-start ${
              isActive
                ? "bg-[var(--sb-active-bg)] font-semibold text-[var(--sb-active-fg)]"
                : "font-medium text-[var(--sb-fg)] hover:bg-[var(--sb-hover-bg)]"
            }`}
            onPress={() => navigate(item.href)}
          >
            {item.icon && (
              <Icon
                aria-hidden
                name={item.icon as IconName}
                size={20}
                strokeWidth={2}
              />
            )}
            <span className="truncate text-[14px]">{item.title}</span>
          </Button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Disparador móvil (flotante arriba-izquierda) */}
      <Button
        ref={openButtonRef}
        disableRipple
        unstyled
        aria-controls="sb-mobile-drawer"
        aria-expanded={isOpen}
        aria-label="Abrir navegación"
        className="fixed left-4 top-4 z-30 inline-flex h-auto min-w-0 items-center justify-center rounded-lg bg-[var(--sb-bg)] p-2 text-[var(--sb-accent)] shadow-md transition-colors duration-200 hover:bg-[var(--sb-hover-bg)] data-[hover=true]:opacity-100 motion-reduce:transition-none md:hidden"
        style={sidebarVars}
        onPress={() => setIsOpen(true)}
      >
        <Icon aria-hidden name="Menu" size={22} />
      </Button>

      {/* Overlay móvil */}
      <div
        aria-hidden
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 motion-reduce:transition-none md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer móvil */}
      <div
        aria-label={ariaLabel}
        aria-modal="true"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-[var(--sb-bg)] shadow-xl transition-transform duration-300 ease-out motion-reduce:transition-none md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${className}`}
        id="sb-mobile-drawer"
        role="dialog"
        style={sidebarVars}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--sb-border)] px-4">
          <span className="text-[15px] font-bold text-[var(--sb-fg)]">
            Navegación
          </span>
          <Button
            ref={closeButtonRef}
            disableRipple
            unstyled
            aria-label="Cerrar navegación"
            className="inline-flex h-auto min-w-0 items-center justify-center rounded-lg bg-transparent p-2 text-[var(--sb-fg)] transition-colors duration-200 hover:bg-[var(--sb-hover-bg)] data-[hover=true]:opacity-100 motion-reduce:transition-none"
            onPress={() => setIsOpen(false)}
          >
            <Icon aria-hidden name="X" size={22} />
          </Button>
        </div>
        <div className="min-h-0 flex-1">
          <NavItems />
        </div>
      </div>

      {/* Sidebar escritorio */}
      <div
        className={`sticky top-0 hidden h-screen w-72 shrink-0 border-r border-[var(--sb-border)] bg-[var(--sb-bg)] md:block ${className}`}
        style={sidebarVars}
      >
        <NavItems />
      </div>
    </>
  );
};

export default Sidebar;
