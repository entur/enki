import cx from 'classnames';
import { ReactElement } from 'react';

import LoadingIcon from '../icons/Loading';

import './styles.scss';

type Props = {
  isLoading?: boolean;
  isFullScreen?: boolean;
  ignoreOverlay?: boolean;
  text: string;
  className?: string;
  children: ReactElement | null | (() => ReactElement);
};

const Loading = ({
  className,
  isLoading = true,
  isFullScreen,
  ignoreOverlay = false,
  text,
  children,
}: Props) => {
  if (!isLoading) {
    return typeof children === 'function' ? children() : children;
  }

  const classNames = cx(
    'loader',
    className,
    { visible: isLoading },
    { fullscreen: isFullScreen },
    { 'ignore-overlay': ignoreOverlay },
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
