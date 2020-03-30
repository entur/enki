import React, { ReactElement } from 'react';
import cx from 'classnames';

import './styles.scss';

type Props = {
  children: ReactElement[];
  className?: string;
  style?: string;
};

const Menu = ({ children, className, style }: Props) => {
  const classNames = cx('menu', className);
  return (
    <div className={classNames} {...style}>
      {children}
    </div>
  );
};

Menu.displayName = 'Menu';

export default Menu;
