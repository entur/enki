import { Button } from '@mui/material';
import ConfirmDialog from 'components/ConfirmDialog';
import { useIntl } from 'react-intl';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const DeleteStopPointDialog = ({
  isOpen,
  onClose,
  onConfirm,
}: Props) => {
  const { formatMessage } = useIntl();
  return (
    <ConfirmDialog
      isOpen={isOpen}
      title={formatMessage({ id: 'deleteStopPointDialogTitle' })}
      message={formatMessage({ id: 'deleteStopPointDialogMessage' })}
      buttons={[
        <Button key="no" variant="outlined" onClick={onClose}>
          {formatMessage({ id: 'no' })}
        </Button>,
        <Button
          key="yes"
          variant="contained"
          color="success"
          onClick={onConfirm}
        >
          {formatMessage({ id: 'yes' })}
        </Button>,
      ]}
      onDismiss={onClose}
    />
  );
};
