import React from 'react';
import PropTypes from 'prop-types';

import './styles.css';

const RadioButton = props => {
  return (
    <div className="radio-button-icon">
      {props.checked && <div className="checked" />}
    </div>
  );
};

PropTypes.defaultProps = {
  checked: false
};

PropTypes.propTypes = {
  checked: PropTypes.bool
};

export default RadioButton;
