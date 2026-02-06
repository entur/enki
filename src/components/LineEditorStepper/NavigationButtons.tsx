import { Button } from '@mui/material';
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
          <Button variant="outlined" onClick={props.onCancel}>
            {formatMessage({ id: 'navigationCancel' })}
          </Button>
        )}
        {!props.editMode && !props.firstStep && (
          <Button variant="outlined" onClick={props.onPrevious}>
            {formatMessage({ id: 'navigationPrevious' })}
          </Button>
        )}
        {props.editMode && !props.lastStep && (
          <Button
            variant="outlined"
            onClick={props.onNext}
            disabled={!props.currentStepIsValid}
          >
            {formatMessage({ id: 'navigationNext' })}
          </Button>
        )}
        {!props.editMode && !props.lastStep && (
          <Button
            variant="contained"
            onClick={props.onNext}
            disabled={!props.currentStepIsValid}
          >
            {formatMessage({ id: 'navigationNext' })}
          </Button>
        )}
        {props.editMode && (
          <Button
            variant="contained"
            onClick={props.onSave}
            disabled={!props.isValid}
          >
            {formatMessage({ id: 'editorSaveButtonText' })}
          </Button>
        )}
        {!props.editMode && props.lastStep && (
          <Button
            variant="contained"
            color="success"
            onClick={props.onSave}
            disabled={!props.isValid}
          >
            {formatMessage({ id: 'editorSaveAndCreateLine' })}
          </Button>
        )}
        {props.editMode && props.firstStep && (
          <Button
            variant="contained"
            color="error"
            onClick={() => setDeleteDialogOpen(true)}
            className="delete"
          >
            {formatMessage({ id: 'editorDeleteButtonText' })}
          </Button>
        )}
      </div>
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title={formatMessage({ id: 'editorDeleteLineConfirmationDialogTitle' })}
        message={formatMessage({
          id: 'editorDeleteLineConfirmationDialogMessage',
        })}
        buttons={[
          <Button
            variant="outlined"
            key={0}
            onClick={() => setDeleteDialogOpen(false)}
          >
            {formatMessage({
              id: 'editorDeleteConfirmationDialogCancelButtonText',
            })}
          </Button>,
          <Button
            variant="contained"
            color="success"
            key={1}
            onClick={() => {
              props.onDelete();
              setDeleteDialogOpen(false);
            }}
          >
            {formatMessage({
              id: 'editorDeleteConfirmationDialogConfirmButtonText',
            })}
          </Button>,
        ]}
        onDismiss={() => setDeleteDialogOpen(false)}
      />
    </>
  );
};

export default NavigationButtons;
