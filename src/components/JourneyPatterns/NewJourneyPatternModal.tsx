import { FeedbackText, TextField } from '@entur/form';
import { ChangeEvent, useEffect, useState } from 'react';
import { PrimaryButton, SecondaryButton } from '@entur/button';
import { Modal } from '@entur/modal';
import { useIntl } from 'react-intl';

type NewJourneyPatternModalProps = {
  open: boolean;
  onSave: (jpName: string) => void;
  onDismiss: () => void;
  journeyPatternsNames: string[];
};

type ValidationError = {
  duplicateName?: string;
};

const NewJourneyPatternModal = ({
  open,
  onSave,
  onDismiss,
  journeyPatternsNames,
}: NewJourneyPatternModalProps) => {
  const { formatMessage } = useIntl();
  const [newJourneyPatternName, setNewJourneyPatternName] = useState<
    string | null
  >(null);
  const [validationError, setValidationError] = useState<ValidationError>({});

  useEffect(() => {
    if (
      newJourneyPatternName &&
      journeyPatternsNames.includes(newJourneyPatternName.trim())
    ) {
      setValidationError({
        duplicateName: formatMessage({
          id: 'journeyPatternDuplicateNameValidationError',
        }),
      });
      return;
    }
    setValidationError({});
  }, [newJourneyPatternName, journeyPatternsNames]);

  return (
    <Modal
      size="small"
      open={open}
      title={formatMessage({ id: 'newJourneyPatternModalTitle' })}
      onDismiss={onDismiss}
      className="modal"
    >
      {formatMessage({ id: 'newJourneyPatternModalSubTitle' })}
      <div className="modal-content">
        <TextField
          label={formatMessage({ id: 'newJourneyPatternModalLabel' })}
          className="modal-input"
          placeholder={formatMessage({
            id: 'newJourneyPatternModalPlaceholder',
          })}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setNewJourneyPatternName(e.target.value);
          }}
        />
        {validationError.duplicateName && (
          <FeedbackText variant="error">
            {formatMessage({ id: 'newJourneyPatternModalUniqueName' })}
          </FeedbackText>
        )}
        <div className={'confirm-dialog-buttons'}>
          <SecondaryButton onClick={() => onDismiss()} className="margin-right">
            {formatMessage({ id: 'newJourneyPatternModalCancel' })}
          </SecondaryButton>
          <PrimaryButton
            onClick={() => onSave(newJourneyPatternName ?? '')}
            disabled={!!validationError.duplicateName}
          >
            {formatMessage({ id: 'newJourneyPatternModalCreate' })}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
};

export default NewJourneyPatternModal;
