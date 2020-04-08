import React, { Fragment, ReactElement } from 'react';
import cx from 'classnames';
import LoadingIcon from '../icons/Loading';
import './styles.scss';

type Props = {
  isLoading: boolean;
  seeThrough?: boolean;
  text?: string;
  className?: string;
  children: ReactElement | ReactElement[];
};

const OverlayLoader = ({
  className,
  isLoading,
  text,
  children,
  seeThrough = true,
}: Props) => {
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

export default OverlayLoader;
