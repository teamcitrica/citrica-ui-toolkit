import * as React from 'react';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: 'display' | 'headline' | 'title' | 'subtitle' | 'body' | 'label' | 'headlinecustom';
  weight?: 'light' | 'normal' | 'bold';
  color?: string;
  textColor?: string;
  className?: string;
  isAdmin?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  color,
  weight = 'normal',
  textColor = 'color-black',
  className = '',
  as: Component = 'span',
  isAdmin = false,
}) => {
  const colorStyle = color ? { color } : { color: `var(--${textColor})` };

  const weightClass = weight !== 'normal' ? `text-${variant}-${weight}` : '';

  const isAdminSuffix = isAdmin ? '-admin' : '';

  const classes = [
    `text-${variant}${isAdminSuffix}`,
    'text-component',
    weightClass,
    className
  ].filter(Boolean).join(' ')

  return (
    <Component
      className={classes}
      style={colorStyle}
    >
      {children}
    </Component>
  );
};
