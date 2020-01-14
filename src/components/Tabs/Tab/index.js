import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import './styles.scss';

const Tab = props => {
  const { children, className, disabled } = props;
  const classNames = cx('tab-content', className, { disabled });
  return <div className={classNames}>{children}</div>;
};

Tab.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool
};
Tab.defaultProps = {
  label: 'Tab',
  className: '',
  disabled: false
};

export default Tab;
