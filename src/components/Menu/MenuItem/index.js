import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { RightArrowIcon } from '@entur/icons';

import './styles.css';

class MenuItem extends React.Component {
  state = {
    active: false,
    position: null
  };

  toggleActive() {
    this.setState(state => ({
      active: !state.active
    }));
  }

  render() {
    const { disabled, onClick, children, menuItems, childrenLeft } = this.props;
    const { active, position } = this.state;

    const hasMenuItems = menuItems && menuItems.length > 0;
    const showSubItems = hasMenuItems && active;

    const handleOnClick = hasMenuItems ? this.toggleActive.bind(this) : onClick;

    const menuItemClasses = cx('menu-item', {
      active,
      disabled,
      'space-between': hasMenuItems,
      'bold-text': hasMenuItems
    });

    const xOffSet = 15;
    const yOffSet = 12;
    const left = position ? position.width + xOffSet : 0;
    const bottom = position
      ? position.top + Math.ceil(position.height / 2) + yOffSet
      : 0;

    const childPositionStyle = {
      left: left * (childrenLeft ? -1 : 1),
      bottom
    };

    return (
      <div className="menu-item-wrapper">
        <div
          className={menuItemClasses}
          onClick={handleOnClick}
          ref={el => {
            if (el && position === null) {
              this.setState({
                position: el.getBoundingClientRect()
              });
            }
          }}
        >
          <div>{children}</div>
          {hasMenuItems && (
            <div className="menu-item-more">{<RightArrowIcon color="#000" />}</div>
          )}
        </div>
        {showSubItems && (
          <div style={childPositionStyle} className="menu-item-nested">
            {menuItems}
          </div>
        )}
      </div>
    );
  }
}

MenuItem.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  menuItems: PropTypes.arrayOf(PropTypes.node),
  childrenLeft: PropTypes.bool
};

MenuItem.defaultProps = {
  childrenLeft: false
};

MenuItem.displayName = 'MenuItem';

export default MenuItem;
