"use client";
import React from 'react';
import { Accordion as HeroAccordion, AccordionItem as HeroAccordionItem } from '@heroui/accordion';
import classNames from 'classnames';
import { Text } from '../../atoms/Text';

export interface AccordionIndicatorProps {
  indicator?: React.ReactNode;
  isOpen?: boolean;
  isDisabled?: boolean;
}

export interface AccordionItemData {
  key: string | number;
  title: React.ReactNode;
  content: React.ReactNode;
  ariaLabel?: string;
  subtitle?: React.ReactNode;
  startContent?: React.ReactNode;
  indicator?: React.ReactNode | ((props: AccordionIndicatorProps) => React.ReactNode) | null;
  isCompact?: boolean;
  isDisabled?: boolean;
  hideIndicator?: boolean;
  disableAnimation?: boolean;
  disableIndicatorAnimation?: boolean;
  keepContentMounted?: boolean;
  motionProps?: any;
  classNames?: AccordionItemClassNames;
  headingComponent?: React.ElementType;
  onPress?: (e: any) => void;
  onPressStart?: (e: any) => void;
  onPressEnd?: (e: any) => void;
  onPressChange?: (isPressed: boolean) => void;
  onPressUp?: (e: any) => void;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
  onFocusChange?: (isFocused: boolean) => void;
  onKeyDown?: (e: any) => void;
  onKeyUp?: (e: any) => void;
}

export interface AccordionItemClassNames {
  base?: string;
  heading?: string;
  trigger?: string;
  titleWrapper?: string;
  title?: string;
  subtitle?: string;
  startContent?: string;
  indicator?: string;
  content?: string;
}

export interface AccordionProps {
  items: AccordionItemData[];
  variant?: 'light' | 'shadow' | 'bordered' | 'splitted';
  selectionMode?: 'single' | 'multiple' | 'none';
  selectionBehavior?: 'toggle' | 'replace';
  defaultExpandedKeys?: Iterable<string | number> | 'all';
  expandedKeys?: Iterable<string | number> | 'all';
  disabledKeys?: Iterable<string | number>;
  disallowEmptySelection?: boolean;
  onSelectionChange?: (keys: any) => void;
  onExpandedChange?: (keys: any) => void;
  isCompact?: boolean;
  isDisabled?: boolean;
  hideIndicator?: boolean;
  disableAnimation?: boolean;
  disableIndicatorAnimation?: boolean;
  showDivider?: boolean;
  dividerProps?: any;
  keepContentMounted?: boolean;
  motionProps?: any;
  fullWidth?: boolean;
  className?: string;
  itemClasses?: AccordionItemClassNames;
  isAdmin?: boolean;
}

const Accordion = ({
  items,
  variant = 'splitted',
  selectionMode = 'multiple',
  selectionBehavior,
  defaultExpandedKeys,
  expandedKeys,
  disabledKeys,
  disallowEmptySelection,
  onSelectionChange,
  onExpandedChange,
  isCompact = false,
  isDisabled = false,
  hideIndicator = false,
  disableAnimation = false,
  disableIndicatorAnimation = false,
  showDivider = true,
  dividerProps,
  keepContentMounted = false,
  motionProps,
  fullWidth = true,
  className,
  itemClasses,
  isAdmin = false,
}: AccordionProps) => {
  const adminSuffix = isAdmin ? '-admin' : '';

  const defaultItemClasses: AccordionItemClassNames = {
    base: classNames('accordion-item-citrica-ui', `accordion-item-${variant}${adminSuffix}`),
    title: 'accordion-item-title-citrica-ui',
    trigger: 'accordion-item-trigger-citrica-ui',
    content: 'accordion-item-content-citrica-ui',
    indicator: `accordion-item-indicator-citrica-ui${adminSuffix}`,
  };

  const mergedItemClasses: AccordionItemClassNames = {
    ...defaultItemClasses,
    ...itemClasses,
    base: classNames(defaultItemClasses.base, itemClasses?.base),
    title: classNames(defaultItemClasses.title, itemClasses?.title),
    trigger: classNames(defaultItemClasses.trigger, itemClasses?.trigger),
    content: classNames(defaultItemClasses.content, itemClasses?.content),
    indicator: classNames(defaultItemClasses.indicator, itemClasses?.indicator),
  };

  return (
    <HeroAccordion
      variant={variant}
      selectionMode={selectionMode}
      selectionBehavior={selectionBehavior}
      defaultExpandedKeys={defaultExpandedKeys as any}
      expandedKeys={expandedKeys as any}
      disabledKeys={disabledKeys as any}
      disallowEmptySelection={disallowEmptySelection}
      onSelectionChange={onSelectionChange}
      onExpandedChange={onExpandedChange}
      isCompact={isCompact}
      isDisabled={isDisabled}
      hideIndicator={hideIndicator}
      disableAnimation={disableAnimation}
      disableIndicatorAnimation={disableIndicatorAnimation}
      showDivider={showDivider}
      dividerProps={dividerProps}
      keepContentMounted={keepContentMounted}
      motionProps={motionProps}
      fullWidth={fullWidth}
      className={classNames('accordion-citrica-ui', `accordion-${variant}${adminSuffix}`, className)}
      itemClasses={mergedItemClasses}
    >
      {items.map((item) => {
        const titleNode =
          typeof item.title === 'string' ? (
            <Text variant="subtitle" weight="bold" isAdmin={isAdmin}>
              {item.title}
            </Text>
          ) : (
            item.title
          );

        const contentNode =
          typeof item.content === 'string' ? (
            <Text variant="body" isAdmin={isAdmin}>
              {item.content}
            </Text>
          ) : (
            item.content
          );

        return (
          <HeroAccordionItem
            key={item.key.toString()}
            aria-label={item.ariaLabel ?? (typeof item.title === 'string' ? item.title : `accordion-item-${item.key}`)}
            title={titleNode}
            subtitle={item.subtitle}
            startContent={item.startContent}
            indicator={item.indicator as any}
            isCompact={item.isCompact}
            isDisabled={item.isDisabled}
            hideIndicator={item.hideIndicator}
            disableAnimation={item.disableAnimation}
            disableIndicatorAnimation={item.disableIndicatorAnimation}
            keepContentMounted={item.keepContentMounted}
            motionProps={item.motionProps}
            classNames={item.classNames}
            HeadingComponent={item.headingComponent}
            onPress={item.onPress}
            onPressStart={item.onPressStart}
            onPressEnd={item.onPressEnd}
            onPressChange={item.onPressChange}
            onPressUp={item.onPressUp}
            onFocus={item.onFocus}
            onBlur={item.onBlur}
            onFocusChange={item.onFocusChange}
            onKeyDown={item.onKeyDown}
            onKeyUp={item.onKeyUp}
          >
            {contentNode}
          </HeroAccordionItem>
        );
      })}
    </HeroAccordion>
  );
};

export default Accordion;
