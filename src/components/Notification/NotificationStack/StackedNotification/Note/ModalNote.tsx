import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from '@entur/modal';
import { PrimaryButton } from '@entur/button';
import { NotificationTypes } from 'actions/notification';
import { selectIntl } from 'i18n';
import messages from './messages';

type Props = {
  title: string;
  message: string;
  notificationStyle?: Object;
  type: NotificationTypes;
};

const ModalNote = (props: Props) => {
  const [isActive, setActive] = useState<boolean>(true);
  const { formatMessage } = useSelector(selectIntl);
  const { title, message } = props;

  return (
    <Modal
      title={title}
      size="small"
      open={isActive}
      onDismiss={() => setActive(false)}
    >
      <div className="notification-modal">
        <div className="notification-modal-message">{message}</div>

        <PrimaryButton onClick={() => setActive(false)}>
          {formatMessage(messages.button)}
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default ModalNote;
