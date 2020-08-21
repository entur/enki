import React from 'react';
import ConfirmDialog from 'components/ConfirmDialog';
import { SecondaryButton, SuccessButton } from '@entur/button';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
};

export default (props: Props) => {
  const { visible, onDismiss, onConfirm } = props;

  const { formatMessage } = useSelector(selectIntl);

  return (
    <ConfirmDialog
      isOpen={visible}
      onDismiss={onDismiss}
      title={formatMessage('editorDeleteLineConfirmationDialogTitle')}
      message={formatMessage('editorDeleteLineConfirmationDialogMessage')}
      buttons={[
        <SecondaryButton key="no" onClick={onDismiss}>
          {formatMessage('no')}
        </SecondaryButton>,
        <SuccessButton key="yes" onClick={onConfirm}>
          {formatMessage('yes')}
        </SuccessButton>,
      ]}
    />
  );
};
