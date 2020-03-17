import React, { useState } from 'react';
import { Modal } from '@entur/modal';
import { NotificationTypes } from 'actions/notification';

type Props = {
  title: string;
  message: string;
  notificationStyle?: Object;
  type: NotificationTypes;
};

const ModalNote = (props: Props) => {
  const [isActive, setActive] = useState<boolean>(true);
  const { title, message } = props;

  return (
    <Modal
      title={title}
      size="medium"
      open={isActive}
      onDismiss={() => setActive(false)}
    >
      <header></header>
      {message}
    </Modal>
  );
};

export default ModalNote;
