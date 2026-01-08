export interface SubMenuItem {
  title: string;
  href: string;
}

export interface MenuItem {
  title: string;
  href?: string;
  icon?: string;
  subItems?: SubMenuItem[];
}

export interface SidebarProps {
  items: MenuItem[];
  activeHref?: string;
  activeSubHref?: string;
  onItemClick?: (href: string) => void;
  className?: string;
}
