import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
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
    <Dialog open={isActive} onClose={handleDismiss} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <div className="notification-modal">
          <div className="notification-modal-message">{message}</div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleDismiss}>
          {formatMessage({ id: 'flexibleLinesSaveLineSuccessButton' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalNote;
