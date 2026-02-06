import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import React, { ReactElement } from 'react';

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
    <Dialog
      className={className}
      open={isOpen}
      onClose={onDismiss}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">{message}</Typography>
      </DialogContent>
      <DialogActions className="confirm-dialog-buttons">
        {buttons}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
