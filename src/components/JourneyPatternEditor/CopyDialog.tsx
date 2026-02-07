import JourneyPattern from '../../model/JourneyPattern';
import { ChangeEvent, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { JourneyPatternNameValidationError } from '../JourneyPatterns';

type CopyDialogProps = {
  open: boolean;
  journeyPattern: JourneyPattern;
  onSave: (jpName: string) => void;
  onDismiss: () => void;
  validateJourneyPatternName: (
    newJourneyPatternName: string | null,
  ) => JourneyPatternNameValidationError;
};

const CopyDialog = ({
  open,
  journeyPattern,
  onSave,
  onDismiss,
  validateJourneyPatternName,
}: CopyDialogProps) => {
  const { formatMessage } = useIntl();
  const [nameTemplate, setNameTemplate] = useState<string>(
    `${journeyPattern.name || 'New'} (${formatMessage({ id: 'copyInstance' })})`,
  );
  const [validationError, setValidationError] =
    useState<JourneyPatternNameValidationError>({});

  const save = () => {
    onSave(nameTemplate);
  };

  useEffect(() => {
    setValidationError(validateJourneyPatternName(nameTemplate));
  }, [nameTemplate]);

  return (
    <Dialog open={open} onClose={onDismiss} maxWidth="sm" fullWidth>
      <DialogTitle>
        {formatMessage({ id: 'copyJourneyPatternDialogTitle' })}
      </DialogTitle>
      <DialogContent>
        <TextField
          label={formatMessage({
            id: 'copyJourneyPatternDialogNameTemplateLabel',
          })}
          sx={{ mt: 1, maxWidth: 340 }}
          value={nameTemplate}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNameTemplate(e.target.value)
          }
          variant="outlined"
          fullWidth
        />
        {validationError.duplicateName && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {validationError.duplicateName}
          </Typography>
        )}
        {validationError.emptyName && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {validationError.emptyName}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => onDismiss()}>
          {formatMessage({ id: 'copyJourneyPatternDialogCancelButtonText' })}
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => save()}
          disabled={Object.keys(validationError).length > 0}
        >
          {formatMessage({ id: 'copyJourneyPatternDialogSaveButtonText' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CopyDialog;
