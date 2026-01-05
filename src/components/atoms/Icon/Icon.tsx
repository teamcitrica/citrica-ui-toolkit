'use client';
import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

// Define the type for all available Lucide icons
export type IconName = keyof typeof LucideIcons;

export interface IconProps extends LucideProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  color?: string;
  fallback?: IconName;
}

const DEFAULT_SIZE = 20;
const DEFAULT_STROKE_WIDTH = 2;
const DEFAULT_FALLBACK: IconName = 'AlertCircle';

const Icon = ({
  name,
  size = DEFAULT_SIZE,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  fallback = DEFAULT_FALLBACK,
  color,
  ...props
}: IconProps): JSX.Element => {
  // Get the icon component dynamically from the imported Lucide icons
  const IconComponent = LucideIcons[name] || LucideIcons[fallback];

  // Ensure IconComponent is treated as a valid React component
  if (!IconComponent) {
    throw new Error(`Icon "${name}" not found and fallback "${fallback}" is invalid.`);
  }

  // Return the icon with all props passed through
  return React.createElement(IconComponent as React.ComponentType<LucideProps>, {
    size,
    strokeWidth,
    color,
    ...props
  });
};

export default Icon;
