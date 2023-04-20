import React from 'react';
import ConfirmDialog from 'components/ConfirmDialog';
import { SecondaryButton, SuccessButton } from '@entur/button';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
};

export default (props: Props) => {
  const { visible, onDismiss, onConfirm } = props;

  const { formatMessage } = useIntl();

  return (
    <ConfirmDialog
      isOpen={visible}
      onDismiss={onDismiss}
      title={formatMessage({ id: 'editorDeleteLineConfirmationDialogTitle' })}
      message={formatMessage({
        id: 'editorDeleteLineConfirmationDialogMessage',
      })}
      buttons={[
        <SecondaryButton key="no" onClick={onDismiss}>
          {formatMessage({ id: 'no' })}
        </SecondaryButton>,
        <SuccessButton key="yes" onClick={onConfirm}>
          {formatMessage({ id: 'yes' })}
        </SuccessButton>,
      ]}
    />
  );
};
