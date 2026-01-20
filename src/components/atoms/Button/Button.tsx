"use client";
import React from "react";
import { Text } from "../Text/Text";
import { Button as HeroUIButton, ButtonProps as HeroUIButtonProps } from "@heroui/button";
import clsx from "clsx";
import Icon, { IconName } from "../Icon/Icon";

export interface ButtonProps
  extends Omit<HeroUIButtonProps, 'variant'> {
  onPress?: () => void;
  label?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "flat" | "success" | "warning" | "danger";
  textVariant?: "label" | "body" | "title" | "display" | "headline" | "subtitle";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
  isDisabled?: boolean;
  isIconOnly?: boolean;
  isAdmin?: boolean;
  isLoading?: boolean;
  startIcon?: IconName;
  endIcon?: IconName;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  children,
  textVariant = "label",
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  isDisabled = false,
  isIconOnly = false,
  isAdmin = false,
  isLoading = false,
  fullWidth = false,
  startIcon,
  endIcon,
  startContent,
  endContent,
  style,
  ...props
}) => {
  const getBtnClassByVariant = (variant: string, isAdmin: boolean) => {
  switch (variant) {
      case "primary":
        return isAdmin ? "btn-primary-admin" : "btn-primary";
      case "secondary":
        return isAdmin ? "btn-secondary-admin" : "btn-secondary";
      case "success":
        return isAdmin ? "btn-success-admin" : "btn-success";
      case "warning":
        return isAdmin ? "btn-warning-admin" : "btn-warning";
      case "danger":
        return isAdmin ? "btn-danger-admin" : "btn-danger";
      case "flat":
        return isAdmin ? "btn-flat-admin" : "btn-flat";
      default:
        return isAdmin ? "btn-primary-admin" : "btn-primary";
    }
  }

  const getTypeOfButton = (isAdmin: boolean) => {
    return isAdmin ? "btn-citrica-ui-admin" : "btn-citrica-ui";
  }

  const getTextColorByVariant = (variant: string, isAdmin: boolean) => {
  switch (variant) {
      case "primary":
        return isAdmin ? "color-admin-on-primary" : "color-on-primary";
      case "secondary":
        return isAdmin ? "color-admin-on-secondary" : "color-on-secondary";
      case "success":
        return isAdmin ? "color-admin-on-success" : "color-on-success";
      case "warning":
        return isAdmin ? "color-admin-warning" : "color-on-warning";
      case "danger":
        return isAdmin ? "color-admin-on-danger" : "color-on-danger";
      case "flat":
        return isAdmin ? "color-admin-black" : "color-black";
      default:
        return isAdmin ? "color-admin-on-primary" : "color-on-primary";
    }
  }
  const content = children || (label && (
    <Text variant={textVariant} textColor={getTextColorByVariant(variant, isAdmin)} isAdmin={isAdmin}>
      {label}
    </Text>
  ));

  const finalStartContent = startIcon ? <Icon name={startIcon} /> : startContent;
  const finalEndContent = endIcon ? <Icon name={endIcon} /> : endContent;

  return (
    <HeroUIButton
      className={clsx(
        getBtnClassByVariant(variant, isAdmin),
        getTypeOfButton(isAdmin),
        className
      )}
      style={style}
      startContent={finalStartContent}
      endContent={finalEndContent}
      {...props}
    >
      {content}
    </HeroUIButton>
  );
};

export default Button;
