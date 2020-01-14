import React from 'react';
import PropTypes from 'prop-types';

import CheckMark from '../Checkmark';

import './styles.scss';

const Checkbox = props => {
  return <div className="checkbox-icon">{props.checked && <CheckMark />}</div>;
};

PropTypes.propTypes = {
  checked: PropTypes.bool
};
PropTypes.defaultProps = {
  checked: false
};

export default Checkbox;
