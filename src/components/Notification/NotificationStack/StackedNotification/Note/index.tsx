import React, { useEffect } from 'react';
import cx from 'classnames';
import {
  CheckIcon,
  CloseIcon,
  ValidationErrorIcon,
  ValidationInfoIcon,
  WarningIcon,
} from '@entur/icons';
import { VariantType } from '@entur/form';
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
    setTimeout(onDismiss, (dismissAfter ?? 0) + transitionIntervall);
  }, [dismissAfter, onDismiss]);

  const getTypeIcon = (type: VariantType) => {
    if (type === 'success') {
      return (
        <span className="notification-icon success">
          <CheckIcon />
        </span>
      );
    } else if (type === 'error') {
      return (
        <span className="notification-icon error">
          <ValidationErrorIcon />
        </span>
      );
    } else if (type === 'warning') {
      return (
        <span className="notification-icon warning">
          <WarningIcon />
        </span>
      );
    } else if (type === 'info') {
      return (
        <span className="notification-icon info">
          <ValidationInfoIcon />
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
    'notification-' + type
  );

  const titleClassNames = cx('notification-bar-label', type);

  return (
    <div className={wrapperClassNames} style={topOffset}>
      <div className="notification-close">
        <CloseIcon onClick={onCloseClicked} />
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
