import {
  NegativeButton,
  PrimaryButton,
  SecondaryButton,
  SuccessButton,
} from '@entur/button';
import ConfirmDialog from 'components/ConfirmDialog';
import { useState } from 'react';
import { useIntl } from 'react-intl';

type Props = {
  editMode: boolean;
  lastStep: boolean;
  firstStep: boolean;
  currentStepIsValid: boolean;
  isValid: boolean;
  onDelete: () => void;
  onSave: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onCancel: () => void;
};

const NavigationButtons = (props: Props) => {
  const { formatMessage } = useIntl();

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <div className="buttons">
        {!props.editMode && props.firstStep && (
          <SecondaryButton onClick={props.onCancel}>
            {formatMessage({ id: 'navigationCancel' })}
          </SecondaryButton>
        )}
        {!props.editMode && !props.firstStep && (
          <SecondaryButton onClick={props.onPrevious}>
            {formatMessage({ id: 'navigationPrevious' })}
          </SecondaryButton>
        )}
        {props.editMode && !props.lastStep && (
          <SecondaryButton
            onClick={props.onNext}
            disabled={!props.currentStepIsValid}
          >
            {formatMessage({ id: 'navigationNext' })}
          </SecondaryButton>
        )}
        {!props.editMode && !props.lastStep && (
          <PrimaryButton
            onClick={props.onNext}
            disabled={!props.currentStepIsValid}
          >
            {formatMessage({ id: 'navigationNext' })}
          </PrimaryButton>
        )}
        {props.editMode && (
          <PrimaryButton onClick={props.onSave} disabled={!props.isValid}>
            {formatMessage({ id: 'editorSaveButtonText' })}
          </PrimaryButton>
        )}
        {!props.editMode && props.lastStep && (
          <SuccessButton onClick={props.onSave} disabled={!props.isValid}>
            {formatMessage({ id: 'editorSaveAndCreateLine' })}
          </SuccessButton>
        )}
        {props.editMode && props.firstStep && (
          <NegativeButton
            onClick={() => setDeleteDialogOpen(true)}
            className="delete"
          >
            {formatMessage({ id: 'editorDeleteButtonText' })}
          </NegativeButton>
        )}
      </div>
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title={formatMessage({ id: 'editorDeleteLineConfirmationDialogTitle' })}
        message={formatMessage({
          id: 'editorDeleteLineConfirmationDialogMessage',
        })}
        buttons={[
          <SecondaryButton key={0} onClick={() => setDeleteDialogOpen(false)}>
            {formatMessage({
              id: 'editorDeleteConfirmationDialogCancelButtonText',
            })}
          </SecondaryButton>,
          <SuccessButton
            key={1}
            onClick={() => {
              props.onDelete();
              setDeleteDialogOpen(false);
            }}
          >
            {formatMessage({
              id: 'editorDeleteConfirmationDialogConfirmButtonText',
            })}
          </SuccessButton>,
        ]}
        onDismiss={() => setDeleteDialogOpen(false)}
      />
    </>
  );
};

export default NavigationButtons;
