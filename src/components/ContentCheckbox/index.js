import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './styles.scss';

class ContentCheckbox extends React.Component {
  render() {
    const { isChecked, onChange, disabled, children, className } = this.props;

    const labelClassNames = cx(
      'content-checkbox',
      { checked: isChecked },
      { disabled },
      className
    );

    return (
      <label className={labelClassNames}>
        <input
          disabled={disabled}
          checked={isChecked}
          onChange={onChange}
          type="checkbox"
        />
        <div>{children}</div>
      </label>
    );
  }
}

ContentCheckbox.propTypes = {
  isChecked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default ContentCheckbox;
