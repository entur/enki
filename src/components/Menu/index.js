import React from 'react';
import cx from 'classnames';

import './styles.css';

class Menu extends React.Component {
  render() {
    const { children, className, style } = this.props;
    const classNames = cx('menu', className);
    return (
      <div className={classNames} {...style}>
        {children}
      </div>
    );
  }
}

Menu.displayName = 'Menu';

export default Menu;
