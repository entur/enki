import {
  Box,
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ pb: 4 }}>{message}</Box>
        </Box>
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
