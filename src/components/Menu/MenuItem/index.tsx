import React, { ReactElement, useState } from 'react';
import cx from 'classnames';
import { RightArrowIcon } from '@entur/icons';

import './styles.scss';

type Props = {
  disabled?: boolean;
  onClick?: () => void;
  menuItems?: ReactElement[];
  childrenLeft?: boolean;
  children?: ReactElement | string;
};

type Position = {
  top: number;
  height: number;
  width: number;
};

const MenuItem = ({
  disabled = false,
  onClick,
  menuItems,
  childrenLeft = false,
  children,
}: Props) => {
  const [style, setStyle] = useState<{
    active: boolean;
    position: Position | null;
  }>({ active: false, position: null });

  const toggleActive = () =>
    setStyle({
      ...style,
      active: !style.active,
    });

  const { active, position } = style;

  const hasMenuItems = menuItems && menuItems.length > 0;
  const showSubItems = hasMenuItems && active;

  const handleOnClick = hasMenuItems ? toggleActive : onClick;

  const menuItemClasses = cx('menu-item', {
    active,
    disabled,
    'space-between': hasMenuItems,
    'bold-text': hasMenuItems,
  });

  const xOffSet = 15;
  const yOffSet = 12;
  const left = position ? position.width + xOffSet : 0;
  const bottom = position
    ? position.top + Math.ceil(position.height / 2) + yOffSet
    : 0;

  const childPositionStyle = {
    left: left * (childrenLeft ? -1 : 1),
    bottom,
  };

  return (
    <div className="menu-item-wrapper">
      <div
        className={menuItemClasses}
        onClick={handleOnClick}
        ref={(el) => {
          if (el && position === null) {
            setStyle({
              ...style,
              position: el.getBoundingClientRect(),
            });
          }
        }}
      >
        <div>{children}</div>
        {hasMenuItems && (
          <div className="menu-item-more">
            {<RightArrowIcon color="#000" />}
          </div>
        )}
      </div>
      {showSubItems && (
        <div style={childPositionStyle} className="menu-item-nested">
          {menuItems}
        </div>
      )}
    </div>
  );
};

MenuItem.displayName = 'MenuItem';

export default MenuItem;
