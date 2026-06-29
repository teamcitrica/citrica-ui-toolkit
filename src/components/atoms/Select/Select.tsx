'use client';
import React from 'react';
import { Select as HeroSelect, SelectItem } from '@heroui/select';
import clsx from 'clsx';
import Icon, { IconName } from '../Icon/Icon';
export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

/** Item seleccionado que se pasa a renderValue (compatible con HeroUI) */
export interface SelectedItem extends SelectOption {
  /** Key del item (igual a value) */
  key: string;
  /** Texto del item (igual a label) */
  textValue: string;
  /** Data original del item */
  data?: SelectOption;
}

/** Tipo para la función renderValue */
export type RenderValueFunction = (items: SelectedItem[]) => React.ReactNode;

export interface SelectProps {
  label?: string;
  placeholder?: string;
  defaultSelectedKeys?: string[];
  selectedKeys?: string[];
  onSelectionChange?: (keys: any) => void;
  name?: string;
  variant?:
    | "primary"
    | "secondary"
    | "flat"
    | "bordered"
    | "faded"
    | "underlined";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  required?: boolean;
  disabled?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  description?: string;
  className?: string;
  classNames?: {
    base?: string;
    trigger?: string;
    label?: string;
    value?: string;
    selectorIcon?: string;
    description?: string;
    errorMessage?: string;
  };
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  startIcon?: IconName;
  endIcon?: IconName;
  iconSize?: number;
  iconColor?: string;
  fullWidth?: boolean;
  options: SelectOption[];
  /** Función para renderizar el valor seleccionado. Por defecto muestra el label del item seleccionado */
  renderValue?: RenderValueFunction;
  isAdmin?: boolean;
  /**
   * Si el popover bloquea el scroll de la página al abrirse. Por defecto `false`:
   * un select en línea no necesita bloquear el scroll y, al hacerlo, react-aria
   * pone `overflow:hidden` en <html> y rompe los `position: sticky` (ej. un
   * topbar fijo desaparece). Ponlo en `true` solo si de verdad lo necesitas.
   */
  shouldBlockScroll?: boolean;
}

// Al abrir un listbox (Select/Autocomplete), react-aria enfoca la opción y llama
// `option.scrollIntoView()`, lo que mueve el scroll de la PÁGINA: rompe los
// `position: sticky` (un topbar fijo desaparece) en desktop/Android y, en iOS
// dentro de un modal, hace un scroll que impide seleccionar. Neutralizamos ese
// `scrollIntoView` SOLO para elementos dentro de un listbox. El scroll interno
// del listbox lo hace otra utilidad de react-aria (no este prototipo), así que
// la navegación por teclado entre opciones sigue intacta, y el resto de
// `scrollIntoView` (navegación por anclas, etc.) no se ve afectado.
// Se instala una sola vez (idempotente) la primera vez que se monta un Select.
let listboxScrollIntoViewPatched = false;

function patchListboxScrollIntoView() {
  if (listboxScrollIntoViewPatched || typeof Element === "undefined") return;
  listboxScrollIntoViewPatched = true;

  const original = Element.prototype.scrollIntoView;

  Element.prototype.scrollIntoView = function (
    this: Element,
    ...args: unknown[]
  ) {
    if (
      this instanceof HTMLElement &&
      this.closest('[role="listbox"], [data-slot="listbox"]')
    ) {
      return;
    }

    return (original as (...a: unknown[]) => void).apply(this, args);
  };
}

const Select = ({
  label,
  placeholder,
  defaultSelectedKeys,
  selectedKeys,
  onSelectionChange,
  name,
  variant = "primary",
  color = "default",
  size = "md",
  radius = "md",
  required = false,
  disabled = false,
  isInvalid = false,
  errorMessage,
  description,
  className,
  classNames,
  startContent,
  endContent,
  startIcon,
  endIcon,
  iconSize = 20,
  iconColor,
  fullWidth = true,
  options = [],
  renderValue,
  isAdmin = false,
  shouldBlockScroll = false,
}: SelectProps) => {
  // Desactiva el scroll de página que react-aria dispara al abrir el listbox.
  React.useEffect(() => {
    patchListboxScrollIntoView();
  }, []);

  // Create icon content if icons are provided
  const startIconContent = startIcon ? (
    <Icon color={iconColor} name={startIcon} size={iconSize} />
  ) : (
    startContent
  );

  const endIconContent = endIcon ? (
    <Icon color={iconColor} name={endIcon} size={iconSize} />
  ) : (
    endContent
  );

  const getSelectClassByVariant = (variant: string, isAdmin: boolean) => {
    switch (variant) {
      case "primary":
        return isAdmin ? "select-primary-admin" : "select-primary";
      case "secondary":
        return isAdmin ? "select-secondary-admin" : "select-secondary";
      case "flat":
      case "bordered":
      case "faded":
      case "underlined":
      default:
        return "";
    }
  };

  const getSelectBaseClass = (isAdmin: boolean) => {
    return isAdmin ? "select-citrica-ui-admin" : "select-citrica-ui";
  };

  const getSelectItemClass = (isAdmin: boolean) => {
    return isAdmin ? "select-item-citrica-ui-admin" : "select-item-citrica-ui";
  };

  const shouldUseCustomVariant =
    variant === "primary" || variant === "secondary";
  const heroVariant = shouldUseCustomVariant ? "bordered" : variant;

  // Adaptador para renderValue: convierte los items de HeroUI a SelectedItem
  const handleRenderValue = renderValue
    ? (items: any) => {
        const selectedItems = Array.from(items).map((item: any) => {
          const option = options.find((opt) => opt.value === item.key);

          return {
            key: item.key,
            textValue: item.textValue,
            value: option?.value || item.key,
            label: option?.label || item.textValue,
            description: option?.description,
            startContent: option?.startContent,
            endContent: option?.endContent,
            data: option,
          } as SelectedItem;
        });

        return renderValue(selectedItems);
      }
    : undefined;

  return (
    <HeroSelect
      className={clsx(
        getSelectBaseClass(isAdmin),
        getSelectClassByVariant(variant, isAdmin),
        className,
      )}
      classNames={classNames}
      color={color}
      defaultSelectedKeys={defaultSelectedKeys}
      description={description}
      endContent={endIconContent}
      errorMessage={errorMessage}
      fullWidth={fullWidth}
      isDisabled={disabled}
      isInvalid={isInvalid}
      isRequired={required}
      label={label}
      name={name}
      placeholder={placeholder}
      popoverProps={{ shouldBlockScroll }}
      radius={radius}
      renderValue={handleRenderValue}
      selectedKeys={selectedKeys}
      size={size}
      startContent={startIconContent}
      variant={heroVariant}
      onSelectionChange={onSelectionChange}
    >
      {options.map((option) => (
        <SelectItem
          key={option.value}
          className={getSelectItemClass(isAdmin)}
          description={option.description}
          endContent={option.endContent}
          startContent={option.startContent}
          textValue={option.label}
        >
          {option.label}
        </SelectItem>
      ))}
    </HeroSelect>
  );
};

export default Select;
