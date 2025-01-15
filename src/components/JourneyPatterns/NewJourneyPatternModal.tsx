import { FeedbackText, TextField } from '@entur/form';
import { ChangeEvent, useEffect, useState } from 'react';
import { PrimaryButton, SecondaryButton } from '@entur/button';
import { Modal } from '@entur/modal';
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
        {validationError.emptyName && (
          <FeedbackText variant="error">
            {validationError.emptyName}
          </FeedbackText>
        )}
        {validationError.duplicateName && (
          <FeedbackText variant="error">
            {validationError.duplicateName}
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
