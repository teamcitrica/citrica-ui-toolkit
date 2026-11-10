"use client";
import React from 'react';
import { Button } from '../../atoms/Button';
import { Icon, IconName } from '../../atoms/Icon';
import { Text } from '../../atoms/Text';
import type { SidebarProps, MenuItem } from './types';

// Mismo diseño que el sidebar del panel de Cítrica (citrica-web): filas con
// `Button` flat admin y `Text` admin, con sus colores llevados a los tokens admin
// del sistema. El valor de respaldo es el color original de Cítrica.
// Se pueden sobreescribir por el consumidor vía `style` en el contenedor.
const sidebarVars = {
  "--sb-bg": "var(--color-admin-surface-container-lowest, #FFFFFF)",
  // Íconos y texto de los ítems.
  "--sb-fg": "var(--color-admin-primary, #265197)",
  // Hover y activo de los ítems principales.
  "--sb-item-bg": "var(--color-admin-surface, #F0F2F5)",
  // Hover y activo de sub-ítems, rail colapsado y botones de ícono.
  "--sb-sub-bg": "var(--color-admin-on-primary-fixed-variant, #EEF1F7)",
  // Texto del sub-ítem activo y del nombre del usuario.
  "--sb-strong": "var(--color-admin-on-primary-container, #16305A)",
  // Sub-ítems inactivos y rol.
  "--sb-muted": "var(--color-admin-outline-variant, #8192AB)",
  "--sb-border": "var(--color-admin-surface-dim, #D1D7E0)",
  // Botones redondos de celular (☰ y ✕), iguales al ☰ del AdminNavbar.
  "--sb-control-bg": "var(--color-admin-surface-container-low, #F0F3FA)",
  "--sb-control-border": "var(--color-admin-surface-dim, #D5DDEB)",
  "--sb-control-hover": "var(--color-admin-surface-container, #E3E9F4)",
} as React.CSSProperties;

// useLayoutEffect en el cliente (corre antes de pintar) y useEffect en el
// servidor, donde useLayoutEffect avisa por consola.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

// Normaliza un href para comparar rutas: sin hash ni query string, y sin la
// barra final ("/ventas/" y "/ventas" son la misma página).
const normalizeHref = (href?: string) => {
  const path = (href ?? "").split("#")[0].split("?")[0];
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
};

// ¿La ruta actual corresponde a este href? Exacta, o una página interna suya
// ("/ventas/pedidos/123" es de "/ventas/pedidos") salvo que se pida exacta.
// Se compara por segmentos: "/ventas-2025" no es de "/ventas".
const hrefMatches = (current: string, href: string, exact: boolean) => {
  if (!current || !href) return false;
  if (current === href) return true;
  if (exact || href === "/") return false;
  return current.startsWith(href + "/");
};

// De todos los href candidatos, el que mejor corresponde a la ruta actual (el
// más largo), para que "/usuarios/roles" marque "Roles" y no también "Lista"
// ("/usuarios").
const bestMatch = (current: string | undefined, hrefs: string[], exact: boolean) => {
  const c = normalizeHref(current);
  let best = "";
  for (const raw of hrefs) {
    const h = normalizeHref(raw);
    if (h.length > best.length && hrefMatches(c, h, exact)) best = h;
  }
  return best;
};

const isHref = (href: string | undefined, resolved: string) =>
  !!resolved && normalizeHref(href) === resolved;

// Clave estable de un ítem, para recordar qué grupo está abierto aunque la
// lista cambie (por ejemplo, ítems que se filtran al cargar los permisos): un
// índice pasaría a apuntar a otro grupo. Se usa el href, o los href de sus
// sub-ítems; el título solo como último recurso.
// Los grupos se identifican por sus sub-ítems (su `href` suele ser "#" o vacío,
// porque al hacer clic se despliegan y no navegan); el resto, por su href.
const baseKey = (item: MenuItem) =>
  (item.subItems?.length ? item.subItems.map((s) => s.href).join("|") : "") ||
  (item.href && item.href !== "#" ? item.href : "") ||
  `title:${item.title}`;

// Claves de todos los ítems, sin repetidas: si dos ítems darían la misma clave
// (mismos href, o dos "#" sin sub-ítems), al repetido se le agrega su posición.
const buildKeys = (items: MenuItem[]) => {
  const seen = new Map<string, number>();
  return items.map((item) => {
    const k = baseKey(item);
    const n = seen.get(k) ?? 0;
    seen.set(k, n + 1);
    return n === 0 ? k : `${k}#${n}`;
  });
};

// Los roles suelen venir en minúscula de la base («admin») y a la vista quedan
// como una errata.
const capitalize = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

// Iniciales para el avatar: primera letra de las dos primeras palabras.
const initials = (name?: string) =>
  (name ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase();

// Las filas usan el Button de HeroUI, que deja preparado un `outline` de 3px
// para el foco. El sistema lo oculta mientras el botón tiene foco, pero al
// pasar el foco al siguiente ítem reaparecía en el anterior con el color del
// texto y se desvanecía con `transition-colors`: un borde fantasma de ~150ms.
// Por eso cada fila lleva `!outline-0`.

// El hover de `.btn-flat-admin` (CSS del proyecto) pinta el fondo con
// `--color-admin-flat-btn-hover` (un verde oscuro) y fuerza el texto con
// `--color-admin-flat-btn-text-hover` (un morado). Las clases `hover:` de
// Tailwind 4 solo existen en dispositivos con mouse, así que en celular ese
// :hover del proyecto quedaba pegado en el último botón tocado, que parecía
// seleccionado. Cada fila redefine esos dos tokens con su propio fondo de hover
// y su propio color de texto: mismo resultado con mouse o con el dedo.
const flatHover = (bg: string, text: string) =>
  ({ "--color-admin-flat-btn-hover": bg, "--color-admin-flat-btn-text-hover": text }) as React.CSSProperties;
const itemHover = flatHover("var(--sb-item-bg)", "var(--sb-fg)");
const subItemHover = (isActive: boolean) =>
  flatHover("var(--sb-sub-bg)", isActive ? "var(--sb-strong)" : "var(--sb-muted)");

// Botón cuadrado de solo ícono (rail colapsado, colapsar/expandir, abrir/cerrar).
const iconButton =
  "flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--sb-sub-bg)] motion-reduce:transition-none";

// Botón redondo de celular (abrir y cerrar el menú): mismo estilo que el ☰ del
// AdminNavbar, para que se vean iguales con o sin navbar.
const roundButton =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--sb-control-border)] bg-[var(--sb-control-bg)] outline-none transition-colors hover:bg-[var(--sb-control-hover)] focus-visible:ring-2 focus-visible:ring-[var(--sb-fg)] focus-visible:ring-offset-2 motion-reduce:transition-none";

interface AccordionItemProps {
  item: MenuItem;
  panelId: string;
  isOpen: boolean;
  onToggle: () => void;
  /** href del sub-ítem activo, ya resuelto (ver `bestMatch`). */
  activeSub: string;
  onNavigate: (href: string) => void;
}

// Item con sub-ítems en modo expandido: acordeón inline.
function AccordionItem({ item, panelId, isOpen, onToggle, activeSub, onNavigate }: AccordionItemProps) {
  return (
    <div>
      <Button
        isAdmin
        variant="flat"
        aria-controls={panelId}
        aria-expanded={isOpen}
        className="w-full justify-between px-4 py-2 !outline-0 transition-colors hover:!bg-[var(--sb-item-bg)]"
        style={itemHover}
        onPress={onToggle}
      >
        <span className="flex items-center gap-2">
          {item.icon && <Icon aria-hidden name={item.icon as IconName} size={20} className="text-[var(--sb-fg)]" />}
          <Text isAdmin variant="label" color="var(--sb-fg)" className="!uppercase">
            {item.title}
          </Text>
        </span>
        <Icon
          aria-hidden
          name="ChevronDown"
          size={16}
          className={`text-[var(--sb-fg)] transition-transform duration-200 motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
        />
      </Button>

      {/* `hidden` (display:none) también saca los sub-ítems del orden de
          tabulación cuando el grupo está cerrado. La sangría va con margen en
          un <div> y no con padding en un <ul>: los estilos base de los proyectos
          (`ol, ul { padding: 0 }`) le ganan a las clases de Tailwind. */}
      <div id={panelId} className={isOpen ? "ml-6 mt-2 flex flex-col gap-2" : "hidden"}>
        {(item.subItems ?? []).map((subItem, i) => {
          const isActive = isHref(subItem.href, activeSub);

          return (
            <Button
              key={`${i}-${subItem.href}`}
              isAdmin
              variant="flat"
              aria-current={isActive ? "page" : undefined}
              style={subItemHover(isActive)}
              className={`justify-start px-4 py-2 !outline-0 transition-colors hover:!bg-[var(--sb-sub-bg)] ${
                isActive ? "!bg-[var(--sb-sub-bg)]" : ""
              }`}
              onPress={() => onNavigate(subItem.href)}
            >
              <Text
                isAdmin
                variant="label"
                weight="bold"
                color={isActive ? "var(--sb-strong)" : "var(--sb-muted)"}
              >
                {subItem.title}
              </Text>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeHref,
  activeSubHref,
  exactMatch = false,
  onItemClick,
  className = "",
  header,
  collapsedHeader,
  organization,
  organizationShort,
  user,
  collapsible = true,
  storageKey = "citrica-sidebar-collapsed",
  onCollapsedChange,
  ariaLabel = "Navegación principal",
  mobileOpen,
  onMobileOpenChange,
  mobileReturnFocusRef,
}) => {
  // IDs únicos por instancia: el menú se dibuja dos veces (escritorio y drawer
  // móvil), así que cada copia lleva su propio prefijo.
  const uid = React.useId().replace(/:/g, "");
  const drawerId = `${uid}-drawer`;

  // Drawer móvil: propio, o controlado desde afuera (☰ de AdminNavbar).
  const [ownOpen, setOwnOpen] = React.useState(false);
  const isControlled = mobileOpen !== undefined;
  const isOpen = isControlled ? mobileOpen : ownOpen;
  const setIsOpen = (open: boolean) => {
    if (!isControlled) setOwnOpen(open);
    onMobileOpenChange?.(open);
  };
  // Solo afecta al sidebar de escritorio (md+). En móvil es un drawer, siempre expandido.
  const [collapsed, setCollapsed] = React.useState(false);
  // La animación de ancho se activa recién después de aplicar la preferencia
  // guardada; si no, al recargar se vería el panel encogerse de 288px a 76px.
  const [animate, setAnimate] = React.useState(false);
  // Submenú flotante del modo colapsado, identificado por la clave del grupo.
  // `position: fixed` para que no lo recorte el `overflow` del panel.
  const [flyout, setFlyout] = React.useState<{ key: string; top: number; left: number } | null>(null);
  /*
   * Grupo desplegado (por su clave, ver `buildKeys`), uno solo a la vez: abrir
   * otro cierra el que estaba. `null` mientras el usuario no elija ninguno
   * (manda la ruta activa) y `""` si cerró el que estaba abierto.
   */
  const [openGroup, setOpenGroup] = React.useState<string | null>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const openButtonRef = React.useRef<HTMLButtonElement>(null);
  const flyoutRef = React.useRef<HTMLDivElement>(null);
  // Botones del modo colapsado, para ubicar el submenú flotante junto a su
  // ícono y devolverle el foco al cerrarlo.
  const railButtons = React.useRef<Record<string, HTMLButtonElement | null>>({});

  // Preferencia guardada; si no hay, colapsado en tablets (< 1024px), donde un
  // panel de 288px se come buena parte de la pantalla. localStorage puede
  // fallar (modo privado, almacenamiento bloqueado): entonces decide el ancho.
  // Se aplica antes de pintar y sin animación.
  useIsomorphicLayoutEffect(() => {
    if (collapsible) {
      let saved: string | null = null;
      if (storageKey) {
        try {
          saved = localStorage.getItem(storageKey);
        } catch {}
      }
      const initial = saved !== null ? saved === "1" : window.innerWidth < 1024;
      setCollapsed(initial);
      // También se avisa el estado inicial, no solo los cambios manuales: un
      // layout que ajusta su contenido con onCollapsedChange necesita saber
      // cómo arrancó el sidebar.
      onCollapsedChange?.(initial);
    }
    const frame = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(frame);
  }, [collapsible, storageKey]);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    setFlyout(null);
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, next ? "1" : "0");
      } catch {}
    }
    onCollapsedChange?.(next);
  };

  // Al cambiar de página se cierra el submenú flotante y el acordeón vuelve a
  // seguir la ruta: el grupo de la página nueva aparece desplegado aunque antes
  // hubieras abierto otro a mano.
  React.useEffect(() => {
    setFlyout(null);
    setOpenGroup(null);
  }, [activeHref, activeSubHref]);

  // Drawer móvil: Escape cierra, se bloquea el scroll del body y se gestiona el
  // foco (al abrir → botón cerrar; al cerrar → botón que lo abrió).
  React.useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;

    // Quién tenía el foco al abrir, para devolvérselo al cerrar si el
    // consumidor no pasó `mobileReturnFocusRef` (y no hay ☰ propio).
    const previouslyFocused = document.activeElement as HTMLElement | null;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      (mobileReturnFocusRef?.current ?? openButtonRef.current ?? previouslyFocused)?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const closeFlyout = (returnFocus: boolean) => {
    const key = flyout?.key;
    setFlyout(null);
    if (returnFocus && key !== undefined) railButtons.current[key]?.focus();
  };

  // Submenú flotante abierto:
  //  - Se acomoda para no salirse por abajo de la ventana.
  //  - El foco entra al submenú (en la opción activa, o en la primera).
  //  - Escape lo cierra y devuelve el foco al ícono; scroll o cambio de tamaño
  //    también lo cierran, porque su posición deja de coincidir con el ícono.
  useIsomorphicLayoutEffect(() => {
    const el = flyoutRef.current;
    if (!flyout || !el) return;

    const maxTop = window.innerHeight - el.offsetHeight - 8;
    if (flyout.top > maxTop) el.style.top = `${Math.max(8, maxTop)}px`;

    const options = el.querySelectorAll<HTMLElement>('[role="menuitem"]');
    (el.querySelector<HTMLElement>('[role="menuitem"][aria-current="page"]') ?? options[0])?.focus();
  }, [flyout]);

  // Un clic fuera del submenú lo cierra. Se escucha en el documento en vez de
  // poner una capa encima de la página: con una capa, el clic en otro ícono del
  // rail solo cerraba el submenú y había que hacer un segundo clic para abrir
  // el nuevo. El ícono dueño del submenú se excluye: su propio clic lo alterna.
  React.useEffect(() => {
    if (!flyout) return;
    const close = () => setFlyout(null);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const key = flyout.key;
        setFlyout(null);
        railButtons.current[key]?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (flyoutRef.current?.contains(target)) return;
      if (railButtons.current[flyout.key]?.contains(target)) return;
      close();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [flyout]);

  // Flechas, Inicio y Fin recorren las opciones del submenú; Tab lo cierra y
  // deja el foco en el ícono, para seguir por el rail.
  const onFlyoutKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const options = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'));
    if (!options.length) return;
    const current = options.indexOf(document.activeElement as HTMLElement);
    let next: number | null = null;

    if (e.key === "ArrowDown") next = (current + 1) % options.length;
    else if (e.key === "ArrowUp") next = (current - 1 + options.length) % options.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = options.length - 1;
    else if (e.key === "Tab") {
      e.preventDefault();
      closeFlyout(true);
      return;
    }

    if (next !== null) {
      e.preventDefault();
      options[next].focus();
    }
  };

  const navigate = (href?: string) => {
    if (href && href !== "#" && onItemClick) onItemClick(href);
    // Solo se avisa el cierre si el drawer estaba abierto (en escritorio no lo está).
    if (isOpen) setIsOpen(false);
    setFlyout(null);
  };

  // Qué ítem y qué sub-ítem están activos, resueltos una vez para todo el menú.
  let activeMain = bestMatch(
    activeHref,
    items.filter((i) => !i.subItems?.length && i.href).map((i) => i.href as string),
    exactMatch,
  );
  let activeSub = bestMatch(
    activeSubHref,
    items.reduce<string[]>((acc, i) => acc.concat((i.subItems ?? []).map((s) => s.href)), []),
    exactMatch,
  );
  // Una sola opción activa: si un ítem principal y un sub-ítem coinciden con la
  // ruta (ej. "/config" y "/config/usuarios" en /config/usuarios), gana la
  // coincidencia más específica.
  if (activeMain && activeSub) {
    if (activeSub.length >= activeMain.length) activeMain = "";
    else activeSub = "";
  }

  const isGroupActive = (item: MenuItem) =>
    (item.subItems ?? []).some((s) => isHref(s.href, activeSub));

  const keys = buildKeys(items);
  const routeGroupItem = items.find(isGroupActive);
  const routeGroup = routeGroupItem ? keys[items.indexOf(routeGroupItem)] : "";
  const currentGroup = openGroup ?? routeGroup;

  const toggleGroup = (key: string) =>
    setOpenGroup(currentGroup === key ? "" : key);

  const openFlyout = (key: string) => {
    const el = railButtons.current[key];
    if (!el) return;
    const r = el.getBoundingClientRect();
    setFlyout((prev) => (prev?.key === key ? null : { key, top: r.top, left: r.right + 8 }));
  };

  const roleLabel = capitalize(user?.role);
  const hasUser = !!(user?.name || roleLabel || user?.detail);
  const userInitials = initials(user?.name);
  const organizationTitle = typeof organization === "string" ? organization : "";
  const userSummary = [user?.name, roleLabel].filter(Boolean).join(" · ");

  // Avatar: la foto si viene, si no las iniciales (o un ícono si no hay nombre).
  const avatar = (
    <span
      aria-hidden
      className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--sb-sub-bg)]"
    >
      {user?.avatarUrl ? (
        <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
      ) : userInitials ? (
        <Text isAdmin variant="label" weight="bold" color="var(--sb-fg)">
          {userInitials}
        </Text>
      ) : (
        <Icon name="User" size={18} className="text-[var(--sb-fg)]" />
      )}
    </span>
  );

  // Función de render (no un componente) para que React no desmonte el árbol en
  // cada render y no se pierda el foco ni el scroll del panel.
  // Tres zonas: arriba el contexto (logo + organización), al medio el menú con
  // su propio scroll y abajo la cuenta, siempre visible.
  // `scope` distingue la copia de escritorio ("d") de la del drawer móvil ("m").
  const renderNav = (mini: boolean, scope: "d" | "m") => (
    <div className="flex h-full w-full flex-col bg-[var(--sb-bg)] px-2 py-2">
      {/* Logo + organización + botón de colapsar. El botón solo existe en
          escritorio; el drawer móvil siempre va expandido. */}
      {/* En el drawer móvil el botón de colapsar no existe, así que sin logo
          ni organización no hay cabecera (antes quedaba una franja vacía). */}
      {((mini ? collapsedHeader : header) || organization || (collapsible && scope === "d")) && (
        <div
          className={`mb-3 flex shrink-0 border-b border-[var(--sb-border)] pb-3 ${
            mini ? "flex-col items-center gap-2" : "items-center justify-between gap-2 px-4"
          }`}
        >
          {/* La sede va con el logo y no con la cuenta: dice dónde estás
              trabajando. El logo es el mismo en todas las sedes, así que la sede
              tiene que verse también en colapsado. */}
          <div className={`min-w-0 ${mini ? "flex flex-col items-center gap-2" : ""}`}>
            {mini ? collapsedHeader : header}

            {!mini && organization && (
              <div className="mt-1 flex min-w-0 items-center gap-1">
                <Icon aria-hidden name="Building2" size={14} className="shrink-0 text-[var(--sb-muted)]" />
                <Text isAdmin as="div" variant="label" weight="bold" color="var(--sb-strong)" className="truncate">
                  {organization}
                </Text>
              </div>
            )}

            {/* Colapsado: el código corto ("MIR") o, si no hay, el ícono. El
                nombre completo, en el tooltip. */}
            {mini && organization && (
              <span
                role="img"
                aria-label={organizationTitle || "Organización"}
                title={organizationTitle || undefined}
                className="flex h-6 min-w-6 items-center justify-center rounded-md bg-[var(--sb-sub-bg)] px-1.5"
              >
                {organizationShort ? (
                  <Text isAdmin aria-hidden variant="label" weight="bold" color="var(--sb-strong)" className="!text-[10px] !uppercase tracking-wide">
                    {organizationShort}
                  </Text>
                ) : (
                  <Icon aria-hidden name="Building2" size={14} className="text-[var(--sb-fg)]" />
                )}
              </span>
            )}
          </div>
          {collapsible && (
            <button
              type="button"
              aria-label={mini ? "Expandir menú" : "Colapsar menú"}
              title={mini ? "Expandir menú" : "Colapsar menú"}
              className={`${iconButton} hidden h-7 w-7 shrink-0 md:flex`}
              onClick={toggleCollapsed}
            >
              <Icon aria-hidden name={mini ? "ChevronsRight" : "ChevronsLeft"} size={16} className="text-[var(--sb-fg)]" />
            </button>
          )}
        </div>
      )}

      <nav aria-label={ariaLabel} className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        {items.map((item, index) => {
          const hasSub = !!item.subItems && item.subItems.length > 0;
          const key = keys[index];

          // --- Modo colapsado: rail de íconos ---
          if (mini) {
            const isActive = hasSub ? isGroupActive(item) : isHref(item.href, activeMain);
            const isFlyoutOpen = flyout?.key === key;

            return (
              <div key={key} className="mb-1 flex justify-center">
                <button
                  ref={(el) => {
                    railButtons.current[key] = el;
                  }}
                  type="button"
                  aria-label={item.title}
                  title={item.title}
                  aria-current={!hasSub && isActive ? "page" : undefined}
                  aria-haspopup={hasSub ? "menu" : undefined}
                  aria-expanded={hasSub ? isFlyoutOpen : undefined}
                  className={`${iconButton} h-11 w-11 rounded-xl ${isActive || isFlyoutOpen ? "bg-[var(--sb-sub-bg)]" : ""}`}
                  onClick={() => (hasSub ? openFlyout(key) : navigate(item.href))}
                >
                  {item.icon ? (
                    <Icon aria-hidden name={item.icon as IconName} size={20} className="text-[var(--sb-fg)]" />
                  ) : (
                    // Sin ícono: la inicial, para que el ítem no quede vacío.
                    <Text isAdmin aria-hidden variant="label" weight="bold" color="var(--sb-fg)">
                      {item.title.charAt(0)}
                    </Text>
                  )}
                </button>
              </div>
            );
          }

          // --- Modo expandido ---
          if (hasSub) {
            return (
              <div key={key} className="mb-2">
                <AccordionItem
                  activeSub={activeSub}
                  isOpen={currentGroup === key}
                  item={item}
                  panelId={`${uid}-${scope}-g${index}`}
                  onNavigate={navigate}
                  onToggle={() => toggleGroup(key)}
                />
              </div>
            );
          }

          const isActive = isHref(item.href, activeMain);

          return (
            <div key={key} className="mb-2">
              <Button
                isAdmin
                variant="flat"
                aria-current={isActive ? "page" : undefined}
                style={itemHover}
                className={`w-full justify-start gap-2 px-4 py-2 !outline-0 transition-colors hover:!bg-[var(--sb-item-bg)] ${
                  isActive ? "!bg-[var(--sb-item-bg)]" : ""
                }`}
                onPress={() => navigate(item.href)}
              >
                {item.icon && <Icon aria-hidden name={item.icon as IconName} size={20} className="text-[var(--sb-fg)]" />}
                <Text isAdmin variant="label" color="var(--sb-fg)" className="!uppercase">
                  {item.title}
                </Text>
              </Button>
            </div>
          );
        })}
      </nav>

      {/* Cuenta de quien ha entrado, al pie. En colapsado queda solo el avatar,
          con el nombre y el rol en el tooltip. */}
      {hasUser && (
        <div
          className={`mt-2 flex shrink-0 items-center gap-3 border-t border-[var(--sb-border)] pt-3 ${
            mini ? "justify-center" : "px-2"
          }`}
          title={mini ? userSummary : undefined}
          aria-label={mini ? userSummary : undefined}
          role={mini ? "img" : undefined}
        >
          {avatar}
          {!mini && (
            <div className="min-w-0">
              {user?.name && (
                <Text isAdmin as="div" variant="label" weight="bold" color="var(--sb-strong)" className="truncate leading-tight">
                  {user.name}
                </Text>
              )}
              {roleLabel && (
                <Text isAdmin as="div" variant="label" color="var(--sb-muted)" className="truncate leading-tight">
                  {roleLabel}
                </Text>
              )}
              {user?.detail && (
                <Text isAdmin as="div" variant="label" color="var(--sb-muted)" className="truncate leading-tight">
                  {user.detail}
                </Text>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const flyoutItem = flyout ? items[keys.indexOf(flyout.key)] ?? null : null;
  const isCollapsed = collapsible && collapsed;

  return (
    <>
      {/* Botón para abrir el drawer (móvil). Flotante: dentro del flujo ocupaba
          una columna junto al contenido y desaparecía al hacer scroll. */}
      {!isControlled && (
        <button
          ref={openButtonRef}
          type="button"
          aria-controls={drawerId}
          aria-expanded={isOpen}
          aria-label="Abrir navegación"
          className={`${roundButton} fixed left-4 top-4 z-30 md:hidden`}
          style={sidebarVars}
          onClick={() => setIsOpen(true)}
        >
          <Icon aria-hidden name="Menu" size={20} className="text-[var(--sb-fg)]" />
        </button>
      )}

      {/* Drawer móvil — siempre expandido. Cerrado queda `invisible`: fuera
          del orden de tabulación y de los lectores de pantalla, no solo fuera
          de la vista. Al abrir se hace visible al instante (para poder darle el
          foco al botón de cerrar); al cerrar, la visibilidad espera a que
          termine el desplazamiento, para que se vea el panel salir. */}
      <div
        aria-label={ariaLabel}
        aria-modal="true"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-[var(--sb-bg)] duration-300 ease-in-out motion-reduce:transition-none md:hidden ${
          isOpen
            ? "visible translate-x-0 transition-transform"
            : "invisible -translate-x-full transition-[transform,visibility]"
        } ${className}`}
        id={drawerId}
        role="dialog"
        style={sidebarVars}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--sb-border)] px-4">
          <Text isAdmin variant="body" weight="bold" color="var(--sb-strong)">
            Navegación
          </Text>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Cerrar navegación"
            className={roundButton}
            onClick={() => setIsOpen(false)}
          >
            <Icon aria-hidden name="X" size={18} className="text-[var(--sb-fg)]" />
          </button>
        </div>
        <div className="min-h-0 flex-1">{renderNav(false, "m")}</div>
      </div>

      {/* Sidebar escritorio — colapsable */}
      <div
        className={`sticky top-0 hidden h-screen shrink-0 border-r border-[var(--sb-border)] bg-[var(--sb-bg)] md:block ${
          animate ? "transition-[width] duration-200 motion-reduce:transition-none" : ""
        } ${isCollapsed ? "w-[76px]" : "w-72"} ${className}`}
        style={sidebarVars}
      >
        {renderNav(isCollapsed, "d")}
      </div>

      {/* Overlay móvil */}
      {isOpen && (
        <div aria-hidden className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Submenú flotante (modo colapsado) */}
      {flyout && flyoutItem?.subItems && (
        <>
          <div
            ref={flyoutRef}
            role="menu"
            aria-label={flyoutItem.title}
            className="fixed z-50 min-w-[210px] rounded-xl border border-[var(--sb-border)] bg-[var(--sb-bg)] p-2 shadow-lg"
            style={{ ...sidebarVars, top: flyout.top, left: flyout.left }}
            onKeyDown={onFlyoutKeyDown}
          >
            <div className="mb-1 border-b border-[var(--sb-border)] px-2 pb-1.5">
              <Text isAdmin variant="label" weight="bold" color="var(--sb-fg)">
                {flyoutItem.title}
              </Text>
            </div>
            {flyoutItem.subItems.map((subItem, i) => {
              const isActive = isHref(subItem.href, activeSub);
              return (
                <button
                  key={`${i}-${subItem.href}`}
                  type="button"
                  role="menuitem"
                  aria-current={isActive ? "page" : undefined}
                  className={`w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-[var(--sb-sub-bg)] focus-visible:bg-[var(--sb-sub-bg)] ${
                    isActive ? "bg-[var(--sb-sub-bg)]" : ""
                  }`}
                  onClick={() => navigate(subItem.href)}
                >
                  <Text
                    isAdmin
                    variant="label"
                    weight={isActive ? "bold" : "normal"}
                    color={isActive ? "var(--sb-strong)" : "var(--sb-fg)"}
                  >
                    {subItem.title}
                  </Text>
                </button>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
