import React from 'react';
import classNames from 'classnames';

export interface ContainerProps {
  className?: string;
  noPadding?: boolean;
  noLimit?: boolean;
  children?: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  className = '',
  noPadding = false,
  noLimit = false,
  children
}) => {
  const arrayClasses = [
    { [`${className}`]: className },
    'o-container'
  ];

  if (noPadding) {
    arrayClasses.push('no-padding');
  }

  if (noLimit) {
    arrayClasses.push('no-width-limit');
  }

  let classes = classNames(arrayClasses);

  return (
    <div className={classes}>{children}</div>
  );
};

export default Container;
