import React, { ReactElement } from 'react';
import { Paragraph } from '@entur/typography';
import { Modal } from '@entur/modal';

import './styles.scss';

type Props = {
  isOpen: boolean;
  title: string;
  message: string;
  buttons?: React.ReactNode[];
  onDismiss: () => void;
  className?: string;
};
const ConfirmDialog = ({
  isOpen,
  title,
  message,
  buttons = [],
  onDismiss,
  className,
}: Props): ReactElement => {
  return (
    <Modal
      className={className}
      open={isOpen}
      title={title}
      onDismiss={onDismiss}
      size="medium"
    >
      <Paragraph>{message}</Paragraph>
      <div className="confirm-dialog-buttons">{buttons}</div>
    </Modal>
  );
};

export default ConfirmDialog;
