'use client';
import React from 'react';
import { Autocomplete as HeroAutocomplete, AutocompleteItem } from '@heroui/autocomplete';
import clsx from 'clsx';
import Icon, { IconName } from '../Icon/Icon';

export interface AutocompleteOption {
  value: string;
  label: string;
  description?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

export interface AutocompleteProps {
  /** Etiqueta del campo */
  label?: string;
  /** Texto placeholder */
  placeholder?: string;
  /** Key seleccionada (controlado) */
  selectedKey?: string | null;
  /** Key seleccionada por defecto (no controlado) */
  defaultSelectedKey?: string;
  /** Valor del input (controlado) */
  inputValue?: string;
  /** Valor del input por defecto (no controlado) */
  defaultInputValue?: string;
  /** Callback cuando cambia la selección */
  onSelectionChange?: (key: string | null) => void;
  /** Callback cuando cambia el valor del input */
  onInputChange?: (value: string) => void;
  /** Callback cuando se limpia el campo */
  onClear?: () => void;
  /** Nombre del campo para formularios */
  name?: string;
  /** Variante visual */
  variant?: 'primary' | 'secondary' | 'flat' | 'bordered' | 'faded' | 'underlined';
  /** Color del componente */
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  /** Tamaño del componente */
  size?: 'sm' | 'md' | 'lg';
  /** Radio de los bordes */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /** Campo requerido */
  required?: boolean;
  /** Campo deshabilitado */
  disabled?: boolean;
  /** Campo en estado inválido */
  isInvalid?: boolean;
  /** Campo de solo lectura */
  isReadOnly?: boolean;
  /** Mensaje de error */
  errorMessage?: string;
  /** Descripción del campo */
  description?: string;
  /** Clase CSS adicional */
  className?: string;
  /** Clases CSS personalizadas por slot */
  classNames?: {
    base?: string;
    listboxWrapper?: string;
    listbox?: string;
    popoverContent?: string;
    endContentWrapper?: string;
    clearButton?: string;
    selectorButton?: string;
  };
  /** Contenido al inicio del input */
  startContent?: React.ReactNode;
  /** Contenido al final del input */
  endContent?: React.ReactNode;
  /** Icono al inicio (usa lucide-react) */
  startIcon?: IconName;
  /** Icono al final (usa lucide-react) */
  endIcon?: IconName;
  /** Tamaño del icono */
  iconSize?: number;
  /** Color del icono */
  iconColor?: string;
  /** Ocupa el ancho completo */
  fullWidth?: boolean;
  /** Opciones del autocomplete */
  options: AutocompleteOption[];
  /** Permite valores personalizados no en la lista */
  allowsCustomValue?: boolean;
  /** Muestra botón para limpiar */
  isClearable?: boolean;
  /** Qué acción abre el menú */
  menuTrigger?: 'focus' | 'input' | 'manual';
  /** Posición del label */
  labelPlacement?: 'inside' | 'outside' | 'outside-left';
  /** Keys deshabilitadas */
  disabledKeys?: string[];
  /** Altura máxima del listbox */
  maxListboxHeight?: number;
  /** Habilita virtualización para listas grandes */
  isVirtualized?: boolean;
}

const Autocomplete = ({
  label,
  placeholder,
  selectedKey,
  defaultSelectedKey,
  inputValue,
  defaultInputValue,
  onSelectionChange,
  onInputChange,
  onClear,
  name,
  variant = 'primary',
  color = 'default',
  size = 'md',
  radius = 'md',
  required = false,
  disabled = false,
  isInvalid = false,
  isReadOnly = false,
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
  allowsCustomValue = false,
  isClearable = true,
  menuTrigger = 'focus',
  labelPlacement = 'inside',
  disabledKeys,
  maxListboxHeight,
  isVirtualized,
}: AutocompleteProps) => {
  // Create icon content if icons are provided
  const startIconContent = startIcon ? (
    <Icon name={startIcon} size={iconSize} color={iconColor} />
  ) : startContent;

  const endIconContent = endIcon ? (
    <Icon name={endIcon} size={iconSize} color={iconColor} />
  ) : endContent;

  const getAutocompleteClassByVariant = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'autocomplete-primary';
      case 'secondary':
        return 'autocomplete-secondary';
      case 'flat':
      case 'bordered':
      case 'faded':
      case 'underlined':
      default:
        return '';
    }
  };

  const shouldUseCustomVariant = variant === 'primary' || variant === 'secondary';
  const heroVariant = shouldUseCustomVariant ? 'bordered' : variant;

  // Handler para onSelectionChange que convierte Key a string
  const handleSelectionChange = (key: React.Key | null) => {
    if (onSelectionChange) {
      onSelectionChange(key ? String(key) : null);
    }
  };

  return (
    <HeroAutocomplete
      label={label}
      placeholder={placeholder}
      selectedKey={selectedKey}
      defaultSelectedKey={defaultSelectedKey}
      inputValue={inputValue}
      defaultInputValue={defaultInputValue}
      onSelectionChange={handleSelectionChange}
      onInputChange={onInputChange}
      onClear={onClear}
      name={name}
      variant={heroVariant}
      color={color}
      size={size}
      radius={radius}
      isRequired={required}
      isDisabled={disabled}
      isInvalid={isInvalid}
      isReadOnly={isReadOnly}
      errorMessage={errorMessage}
      description={description}
      className={clsx(
        'autocomplete-citrica-ui',
        getAutocompleteClassByVariant(variant),
        className
      )}
      classNames={classNames}
      startContent={startIconContent}
      endContent={endIconContent}
      fullWidth={fullWidth}
      allowsCustomValue={allowsCustomValue}
      isClearable={isClearable}
      menuTrigger={menuTrigger}
      labelPlacement={labelPlacement}
      disabledKeys={disabledKeys}
      maxListboxHeight={maxListboxHeight}
      isVirtualized={isVirtualized}
    >
      {options.map((option) => (
        <AutocompleteItem
          key={option.value}
          textValue={option.label}
          description={option.description}
          startContent={option.startContent}
          endContent={option.endContent}
          className="autocomplete-item-citrica-ui"
        >
          {option.label}
        </AutocompleteItem>
      ))}
    </HeroAutocomplete>
  );
};

export default Autocomplete;
