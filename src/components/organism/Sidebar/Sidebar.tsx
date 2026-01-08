"use client";
import React, { Suspense } from 'react';
import { Button } from '../../atoms/Button';
import { Text } from '../../atoms/Text';
import { Icon } from '../../atoms/Icon';
import type { SidebarProps, MenuItem } from './types';

interface AccordionItemProps {
  item: MenuItem;
  isOpen: boolean;
  onToggle: () => void;
  activeSubHref?: string;
  onItemClick?: (href: string) => void;
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
  activeSubHref,
  onItemClick
}: AccordionItemProps) {
  const handleSubItemClick = (href: string) => {
    if (onItemClick) {
      onItemClick(href);
    }
  };

  const getParamFromHref = (href: string): string => {
    try {
      const url = new URL(href, window.location.origin);
      const params = new URLSearchParams(url.search);
      return params.toString();
    } catch {
      return '';
    }
  };

  return (
    <div>
      <Button
        className="w-full justify-between px-4 py-2 transition-colors hover:bg-gray-100"
        variant="flat"
        onPress={onToggle}
      >
        <span className="flex items-center gap-2">
          <Text variant="label">{item.title}</Text>
        </span>
      </Button>
      {isOpen && item.subItems && (
        <div className="ml-6 mt-2 flex flex-col gap-2">
          {item.subItems.map((subItem) => {
            const isActive = activeSubHref === subItem.href ||
                           getParamFromHref(subItem.href) === getParamFromHref(activeSubHref || '');

            return (
              <Button
                key={subItem.title}
                variant="flat"
                className={`justify-start px-4 py-2 transition-colors hover:bg-gray-100 ${
                  isActive ? "bg-gray-100" : ""
                }`}
                onPress={() => handleSubItemClick(subItem.href)}
              >
                <Text variant="label">{subItem.title}</Text>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeHref,
  activeSubHref,
  onItemClick,
  className = ''
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({});

  const toggleItem = (title: string) => {
    setOpenItems((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleItemClick = (href?: string) => {
    if (href && onItemClick) {
      onItemClick(href);
    }
    setIsOpen(false);
  };

  const NavItems = () => (
    <div className="h-[100svh] w-full overflow-y-auto px-2 py-4 bg-sidebar">
      {items.map((item) => {
        const isItemActive = item.href === activeHref;

        return (
          <div key={item.title} className="mb-2">
            {item.subItems ? (
              <Suspense fallback={<div>Cargando...</div>}>
                <AccordionItem
                  item={item}
                  isOpen={openItems[item.title] || isItemActive || false}
                  onToggle={() => toggleItem(item.title)}
                  activeSubHref={activeSubHref}
                  onItemClick={onItemClick}
                />
              </Suspense>
            ) : (
              <Button
                variant="flat"
                className={`w-full justify-start gap-2 px-4 py-2 transition-colors hover:bg-gray-100 ${
                  isItemActive ? "bg-gray-100" : ""
                }`}
                onPress={() => handleItemClick(item.href)}
              >
                <Text variant="label">{item.title}</Text>
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Button
        className="md:hidden"
        isIconOnly
        variant="flat"
        onPress={() => setIsOpen(true)}
      >
        <Icon name="Menu" size={20} />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-sidebar transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${className}`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <Text variant="title" weight="bold">Navegación</Text>
          <Button
            isIconOnly
            variant="flat"
            onPress={() => setIsOpen(false)}
          >
            <Icon name="X" size={24} />
          </Button>
        </div>
        <NavItems />
      </div>

      {/* Desktop Sidebar */}
      <div className={`hidden h-screen w-72 border-r bg-background md:block ${className}`}>
        <NavItems />
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
