import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import LoadingIcon from '../icons/Loading';

import './styles.scss';

const Loading = ({ className, isLoading, isFullScreen, text, children }) => {
  if (!isLoading) {
    return children;
  }

  const classNames = cx(
    'loader',
    className,
    { visible: isLoading },
    { fullscreen: isFullScreen }
  );

  return (
    <div className={classNames}>
      <div className="spinner">
        <LoadingIcon />
      </div>
      <div className="text">{text}</div>
    </div>
  );
};

Loading.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isFullScreen: PropTypes.bool,
  text: PropTypes.string
};
Loading.defaultProps = {
  isLoading: true
};

export default Loading;
