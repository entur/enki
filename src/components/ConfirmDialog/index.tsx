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
};
const ConfirmDialog = ({
  isOpen,
  title,
  message,
  buttons = [],
  onDismiss,
}: Props): ReactElement => {
  return (
    <Modal open={isOpen} title={title} onDismiss={onDismiss} size="medium">
      <Paragraph>{message}</Paragraph>
      <div className="confirm-dialog-buttons">{buttons}</div>
    </Modal>
  );
};

export default ConfirmDialog;
