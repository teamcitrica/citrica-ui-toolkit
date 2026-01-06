"use client";
import React, { ReactNode } from 'react';
import {Card as CardHeroUI, CardBody as CardBodyHeroUI, CardHeader as CardHeaderHeroUI, CardFooter as CardFooterHeroUI} from "@heroui/card";
import clsx from 'clsx';

export interface CardProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'shadow' | 'bordered' | 'light' | 'flat';
  isPressable?: boolean;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  className,
  shadow = 'sm',
  radius = 'md',
  variant,
  isPressable = false,
  onPress,
  ...props
}) => {
  return (
    <CardHeroUI
      className={clsx(className)}
      shadow={shadow}
      radius={radius}
      //variant={variant}
      isPressable={isPressable}
      onPress={onPress}
    >
      {header && (
        <CardHeaderHeroUI>
          {header}
        </CardHeaderHeroUI>
      )}
      <CardBodyHeroUI>
        {children}
      </CardBodyHeroUI>
      {footer && (
        <CardFooterHeroUI>
          {footer}
        </CardFooterHeroUI>
      )}
    </CardHeroUI>
  );
}

export default Card;
