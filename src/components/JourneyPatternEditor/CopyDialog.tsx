import JourneyPattern from '../../model/JourneyPattern';
import { ChangeEvent, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { FeedbackText, TextField } from '@entur/form';
import { Button, ButtonGroup } from '@entur/button';
import { Modal } from '@entur/modal';

type CopyDialogProps = {
  open: boolean;
  journeyPattern: JourneyPattern;
  onSave: (jpName: string) => void;
  onDismiss: () => void;
  journeyPatternsNames: string[];
};

type ValidationError = {
  duplicateName?: string;
  emptyName?: string;
};

const CopyDialog = ({
  open,
  journeyPattern,
  onSave,
  onDismiss,
  journeyPatternsNames,
}: CopyDialogProps) => {
  const { formatMessage } = useIntl();
  const [nameTemplate, setNameTemplate] = useState<string>(
    `${journeyPattern.name || 'New'} (${formatMessage({ id: 'copyInstance' })})`,
  );
  const [validationError, setValidationError] = useState<ValidationError>({});

  const save = () => {
    onSave(nameTemplate);
  };

  useEffect(() => {
    if (!nameTemplate) {
      setValidationError({
        emptyName: formatMessage({ id: 'nameIsRequired' }),
      });
      return;
    }
    if (journeyPatternsNames.includes(nameTemplate.trim())) {
      setValidationError({
        duplicateName: formatMessage({
          id: 'journeyPatternDuplicateNameValidationError',
        }),
      });
      return;
    }
    setValidationError({});
  }, [journeyPatternsNames, nameTemplate]);

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
