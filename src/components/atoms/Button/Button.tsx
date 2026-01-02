'use client'
import * as React from "react";
import { Text } from "../Text";
import { Button as ButtonHeroUI } from "@heroui/button";
import clsx from "clsx";
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  label?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "flat" | "success" | "warning" | "danger";
  textVariant?: "label" | "body" | "title" | "display" | "headline" | "subtitle";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  isLoading?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  fullWidth?: boolean;
}

const getTextColorByVariant = (variant: string) => {
  switch (variant) {
    case "primary":
      return "color-on-primary";
    case "secondary":
      return "color-on-secondary";
    case "success":
      return "color-on-success";
    case "warning":
      return "color-on-warning";
    case "danger":
      return "color-on-danger";
    case "flat":
      return "color-black";
    default:
      return "color-on-primary";
  }
}

const getBtnClassByVariant = (variant: string) => {
  switch (variant) {
    case "primary":
      return "btn-primary";
    case "secondary":
      return "btn-secondary";
    case "success":
      return "btn-success";
    case "warning":
      return "btn-warning";
    case "danger":
      return "btn-danger";
    case "flat":
      return "btn-flat";
    default:
      return "btn-primary";
  }
}

export const Button = ({
  onClick,
  label,
  children,
  textVariant = "label",
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  isLoading = false,
  startContent,
  endContent,
  fullWidth = false,
  ...props
}: ButtonProps) => {
  const content = children || (label && (
    <Text variant={textVariant} textColor={getTextColorByVariant(variant)}>
      {label}
    </Text>
  ));

  return (
    <ButtonHeroUI
      color="default"
      onPress={onClick}
      className={clsx(
        "btn-citrica-ui",
        getBtnClassByVariant(variant),
        className
      )}
      size={size}
      radius="none"
      type={type}
      isDisabled={disabled}
      isLoading={isLoading}
      startContent={startContent}
      endContent={endContent}
      fullWidth={fullWidth}
    >
      {content}
    </ButtonHeroUI>
  )
}