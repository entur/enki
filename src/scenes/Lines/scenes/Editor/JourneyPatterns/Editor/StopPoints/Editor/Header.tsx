import React from 'react';
import { SuccessButton } from '@entur/button';
import PageHeader from 'components/PageHeader';

type Props = {
  isEditMode: boolean;
  saveDisabled: boolean;
  onSave: () => void;
  onClose: () => void;
};

export default function Header({
  isEditMode,
  onSave,
  onClose,
  saveDisabled
}: Props) {
  return (
    <div className="header">
      <PageHeader
        withBackButton
        onBackButtonClick={onClose}
        title={`${isEditMode ? 'Rediger' : 'Opprett'} Stoppepunkt`}
      />

      <div className="header-buttons">
        <SuccessButton disabled={saveDisabled} onClick={onSave}>
          Lagre
        </SuccessButton>
      </div>
    </div>
  );
}
