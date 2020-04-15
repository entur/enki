import React, { useState } from 'react';
import {
  NegativeButton,
  PrimaryButton,
  SecondaryButton,
  SuccessButton,
} from '@entur/button';
import { useSelector } from 'react-redux';
import { AppIntlState, selectIntl } from 'i18n';
import { GlobalState } from 'reducers';
import ConfirmDialog from 'components/ConfirmDialog';

type Props = {
  editMode: boolean;
  lastStep: boolean;
  onDelete: () => void;
  onSave: () => void;
  onNext: () => void;
};

const NavigationButtons = (props: Props) => {
  const { formatMessage } = useSelector<GlobalState, AppIntlState>(selectIntl);

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <div className="buttons">
        {props.editMode && !props.lastStep && (
          <SecondaryButton onClick={props.onNext}>
            {formatMessage('navigationNext')}
          </SecondaryButton>
        )}
        {!props.editMode && !props.lastStep && (
          <PrimaryButton onClick={props.onNext}>
            {formatMessage('navigationNext')}
          </PrimaryButton>
        )}
        {props.editMode && (
          <PrimaryButton onClick={props.onSave}>
            {formatMessage('editorSaveButtonText')}
          </PrimaryButton>
        )}
        {!props.editMode && props.lastStep && (
          <SuccessButton onClick={props.onSave}>
            {formatMessage('editorSaveAndCreateLine')}
          </SuccessButton>
        )}
        {props.editMode && (
          <NegativeButton
            onClick={() => setDeleteDialogOpen(true)}
            className="delete"
          >
            {formatMessage('editorDeleteButtonText')}
          </NegativeButton>
        )}
      </div>
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title={formatMessage('editorDeleteConfirmationDialogTitle')}
        message={formatMessage('editorDeleteConfirmationDialogMessage')}
        buttons={[
          <SecondaryButton key={0} onClick={() => setDeleteDialogOpen(false)}>
            {formatMessage('editorDeleteConfirmationDialogCancelButtonText')}
          </SecondaryButton>,
          <SuccessButton
            key={1}
            onClick={() => {
              props.onDelete();
              setDeleteDialogOpen(false);
            }}
          >
            {formatMessage('editorDeleteConfirmationDialogConfirmButtonText')}
          </SuccessButton>,
        ]}
        onDismiss={() => setDeleteDialogOpen(false)}
      />
    </>
  );
};

export default NavigationButtons;
