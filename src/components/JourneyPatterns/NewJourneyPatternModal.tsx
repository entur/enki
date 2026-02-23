import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { JourneyPatternNameValidationError } from './index';

type NewJourneyPatternModalProps = {
  open: boolean;
  onSave: (jpName: string) => void;
  onDismiss: () => void;
  validateJourneyPatternName: (
    newJourneyPatternName: string | null,
  ) => JourneyPatternNameValidationError;
};

const NewJourneyPatternModal = ({
  open,
  onSave,
  onDismiss,
  validateJourneyPatternName,
}: NewJourneyPatternModalProps) => {
  const { formatMessage } = useIntl();
  const [newJourneyPatternName, setNewJourneyPatternName] = useState<
    string | null
  >(null);
  const [validationError, setValidationError] =
    useState<JourneyPatternNameValidationError>({});

  useEffect(() => {
    setValidationError(validateJourneyPatternName(newJourneyPatternName));
  }, [newJourneyPatternName]);

  return (
    <Dialog open={open} onClose={onDismiss} maxWidth="xs" fullWidth>
      <DialogTitle>
        {formatMessage({ id: 'newJourneyPatternModalTitle' })}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {formatMessage({ id: 'newJourneyPatternModalSubTitle' })}
        </Typography>
        <TextField
          label={formatMessage({ id: 'newJourneyPatternModalLabel' })}
          placeholder={formatMessage({
            id: 'newJourneyPatternModalPlaceholder',
          })}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setNewJourneyPatternName(e.target.value);
          }}
          variant="outlined"
          fullWidth
        />
        {validationError.emptyName && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {validationError.emptyName}
          </Typography>
        )}
        {validationError.duplicateName && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {validationError.duplicateName}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => onDismiss()}>
          {formatMessage({ id: 'newJourneyPatternModalCancel' })}
        </Button>
        <Button
          variant="contained"
          onClick={() => onSave(newJourneyPatternName ?? '')}
          disabled={!!validationError.duplicateName}
        >
          {formatMessage({ id: 'newJourneyPatternModalCreate' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewJourneyPatternModal;
