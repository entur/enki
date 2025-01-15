import JourneyPattern from '../../model/JourneyPattern';
import { ChangeEvent, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { FeedbackText, TextField } from '@entur/form';
import { Button, ButtonGroup } from '@entur/button';
import { Modal } from '@entur/modal';
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
    <Modal
      open={open}
      size="medium"
      title={formatMessage({ id: 'copyJourneyPatternDialogTitle' })}
      onDismiss={onDismiss}
      className="copy-dialog"
    >
      <TextField
        label={formatMessage({
          id: 'copyJourneyPatternDialogNameTemplateLabel',
        })}
        className="copy-dialog-wide-element"
        value={nameTemplate}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setNameTemplate(e.target.value)
        }
      />
      {validationError.duplicateName && (
        <FeedbackText variant="error">
          {validationError.duplicateName}
        </FeedbackText>
      )}
      {validationError.emptyName && (
        <FeedbackText variant="error">{validationError.emptyName}</FeedbackText>
      )}

      <div className="copy-dialog-section">
        <ButtonGroup>
          <Button variant="negative" onClick={() => onDismiss()}>
            {formatMessage({ id: 'copyJourneyPatternDialogCancelButtonText' })}
          </Button>
          <Button
            variant="success"
            onClick={() => save()}
            disabled={Object.keys(validationError).length > 0}
          >
            {formatMessage({ id: 'copyJourneyPatternDialogSaveButtonText' })}
          </Button>
        </ButtonGroup>
      </div>
    </Modal>
  );
};

export default CopyDialog;
