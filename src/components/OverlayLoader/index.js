import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import LoadingIcon from '../icons/Loading';

import './styles.scss';

const OverlayLoader = ({
  className,
  isLoading,
  text,
  seeThrough,
  children,
}) => {
  const classNames = cx('overlay-loader', className);
  const overlayClassNames = cx('overlay', { seeThrough });
  return (
    <div className={classNames}>
      {isLoading && (
        <Fragment>
          <div className={overlayClassNames} />
          <div className="loader">
            <div className="spinner">
              <LoadingIcon />
            </div>
            <div className="text">{text}</div>
          </div>
        </Fragment>
      )}

      {children}
    </div>
  );
};

OverlayLoader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  seeThrough: PropTypes.bool,
  text: PropTypes.string,
};
OverlayLoader.defaultProps = {
  isLoading: true,
  seeThrough: true,
};

export default OverlayLoader;
