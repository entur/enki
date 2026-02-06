import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import Error from '@mui/icons-material/Error';
import Info from '@mui/icons-material/Info';
import Warning from '@mui/icons-material/Warning';
import { VariantType } from 'helpers/errorHandling';
import cx from 'classnames';
import { useEffect } from 'react';
import '../../../styles.scss';

type Props = {
  title?: string;
  message: string;
  onRequestClose?: () => void;
  onDismiss: () => void;
  dismissAfter?: number;
  topOffset?: object;
  isActive?: boolean;
  type: VariantType;
};

const Note = ({
  title,
  message,
  isActive,
  type,
  topOffset,
  onDismiss,
  dismissAfter,
  onRequestClose,
}: Props) => {
  useEffect(() => {
    const transitionIntervall = 500;
    const dismissTimeout = setTimeout(
      onDismiss,
      (dismissAfter ?? 0) + transitionIntervall,
    );
    return () => clearTimeout(dismissTimeout);
    // eslint-disable-next-line
  }, [dismissAfter]);

  const getTypeIcon = (type: VariantType) => {
    if (type === 'success') {
      return (
        <span className="notification-icon success">
          <Check />
        </span>
      );
    } else if (type === 'error') {
      return (
        <span className="notification-icon error">
          <Error />
        </span>
      );
    } else if (type === 'warning') {
      return (
        <span className="notification-icon warning">
          <Warning />
        </span>
      );
    } else if (type === 'info') {
      return (
        <span className="notification-icon info">
          <Info />
        </span>
      );
    } else {
      return null;
    }
  };

  const onCloseClicked = () => {
    if (typeof onRequestClose === 'function') {
      onRequestClose();
    }
  };

  const wrapperClassNames = cx(
    'notification-default',
    'notification',
    { 'notification-active': isActive },
    { active: isActive },
    'notification-' + type,
  );

  const titleClassNames = cx('notification-bar-label', type);

  return (
    <div className={wrapperClassNames} style={topOffset}>
      <div className="notification-close">
        <Close onClick={onCloseClicked} style={{ cursor: 'pointer' }} />
      </div>
      <div className="notification-bar-wrapper">
        <div className="notification-bar-title">
          {getTypeIcon(type)}
          <span className={titleClassNames}>{title}</span>
        </div>
        <div className="notification-bar-message">{message}</div>
      </div>
    </div>
  );
};

export default Note;
