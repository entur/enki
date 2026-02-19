import { Button } from '@mui/material';
import ConfirmDialog from 'components/ConfirmDialog';
import { useIntl } from 'react-intl';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
};

export default (props: Props) => {
  const { visible, onDismiss, onConfirm } = props;

  const { formatMessage } = useIntl();

  return (
    <ConfirmDialog
      isOpen={visible}
      onDismiss={onDismiss}
      title={formatMessage({ id: 'editorDeleteLineConfirmationDialogTitle' })}
      message={formatMessage({
        id: 'editorDeleteLineConfirmationDialogMessage',
      })}
      buttons={[
        <Button variant="outlined" key="no" onClick={onDismiss}>
          {formatMessage({ id: 'no' })}
        </Button>,
        <Button
          variant="contained"
          color="success"
          key="yes"
          onClick={onConfirm}
        >
          {formatMessage({ id: 'yes' })}
        </Button>,
      ]}
    />
  );
};
