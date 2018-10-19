import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './styles.css';

const IconButton = ({
  icon,
  label,
  labelPosition,
  disabled,
  onClick,
  className,
  ...buttonProps
}) => (
  <div className={cx('icon-button-wrapper', className)}>
    {label &&
      labelPosition === 'left' && (
        <span className="label left" onClick={onClick}>
          {label}
        </span>
      )}
    <button
      className="icon-button"
      disabled={disabled}
      onClick={onClick}
      {...buttonProps}
    >
      {icon}
    </button>
    {label &&
      labelPosition === 'right' && (
        <span className="label right" onClick={onClick}>
          {label}
        </span>
      )}
  </div>
);

IconButton.defaultProps = {
  labelPosition: 'left'
};

IconButton.propTypes = {
  icon: PropTypes.object.isRequired,
  label: PropTypes.string,
  labelPosition: PropTypes.oneOf(['left', 'right']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

export default IconButton;
