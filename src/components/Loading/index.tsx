import React, { ReactElement } from 'react';
import cx from 'classnames';

import LoadingIcon from '../icons/Loading';

import './styles.scss';

type Props = {
  isLoading?: boolean;
  isFullScreen?: boolean;
  text: string;
  className?: string;
  children: ReactElement | null;
};

const Loading = ({
  className,
  isLoading = true,
  isFullScreen,
  text,
  children,
}: Props) => {
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

export default Loading;
