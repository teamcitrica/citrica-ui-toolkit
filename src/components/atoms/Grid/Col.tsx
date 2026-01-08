import React from 'react';
import classNames from 'classnames';

export interface ColSizes {
  lg?: number;
  md?: number;
  sm?: number;
  lgPush?: number;
  mdPush?: number;
  smPush?: number;
}

export interface ColProps {
  cols: ColSizes;
  noPadding?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Col: React.FC<ColProps> = ({
  cols,
  noPadding = false,
  className = '',
  children
}) => {
  const { lg, md, sm, lgPush, mdPush, smPush } = cols;

  const arrayClasses: Array<string | Record<string, boolean>> = [
    { [`o-col-${lg}@lg`]: !!lg },
    { [`o-col-push-${lgPush}@lg`]: !!lgPush },
    { [`o-col-${md}@md`]: !!md },
    { [`o-col-push-${mdPush}@md`]: !!mdPush },
    { [`o-col-${sm}@sm`]: !!sm },
    { [`o-col-${smPush}@sm`]: !!smPush },
  ];

  if (className) {
    arrayClasses.push(className);
  }

  if (noPadding) {
    arrayClasses.push('no-padding');
  }

  const classes = classNames(arrayClasses);

  return (
    <div className={classes}>{children}</div>
  );
};

export default Col;
