import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from '@entur/modal';
import { PrimaryButton } from '@entur/button';
import { selectIntl } from 'i18n';

type Props = {
  title: string;
  message: string;
  topOffset?: Object;
  onDismiss: () => void;
};

const ModalNote = (props: Props) => {
  const [isActive, setActive] = useState<boolean>(true);
  const { formatMessage } = useSelector(selectIntl);
  const { title, message, onDismiss } = props;

  const handleDismiss = useCallback(() => {
    onDismiss();
    setActive(false);
  }, [onDismiss]);

  return (
    <Modal title={title} size="small" open={isActive} onDismiss={handleDismiss}>
      <div className="notification-modal">
        <div className="notification-modal-message">{message}</div>

        <PrimaryButton onClick={handleDismiss}>
          {formatMessage('flexibleLinesSaveLineSuccessButton')}
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default ModalNote;
