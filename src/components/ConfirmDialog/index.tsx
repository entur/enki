import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import React, { ReactElement } from 'react';

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
      <DialogActions
        sx={{
          display: 'flex',
          mt: '2rem',
          maxWidth: '100%',
          justifyContent: 'space-between',
          '& button': {
            width: '100%',
            maxWidth: '20rem',
          },
          '& > :first-of-type': {
            mr: '2rem',
          },
        }}
      >
        {buttons}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
