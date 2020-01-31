import React from 'react';
import { SuccessButton } from '@entur/button';
import PageHeader from 'components/PageHeader';

export default function Header({ isEditMode, onSave, onClose }) {
  return (
    <div className="header">
      <PageHeader
        withBackButton
        onBackButtonClick={onClose}
        title={`${isEditMode ? 'Rediger' : 'Opprett'} Stoppepunkt`}
      />

      <div className="header-buttons">
        <SuccessButton onClick={onSave}>Lagre</SuccessButton>
      </div>
    </div>
  );
}
