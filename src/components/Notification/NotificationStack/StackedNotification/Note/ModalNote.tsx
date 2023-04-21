import { PrimaryButton } from '@entur/button';
import { Modal } from '@entur/modal';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';

type Props = {
  title: string;
  message: string;
  topOffset?: Object;
  onDismiss: () => void;
};

const ModalNote = (props: Props) => {
  const [isActive, setActive] = useState<boolean>(true);
  const { formatMessage } = useIntl();
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
          {formatMessage({ id: 'flexibleLinesSaveLineSuccessButton' })}
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default ModalNote;
