import React from 'react';
import { SuccessButton } from '@entur/button';

export default function Header({ isEditMode, onSave }) {
  return (
    <div className="header">
      <h2>{isEditMode ? 'Rediger' : 'Opprett'} Stoppepunkt</h2>

      <div className="header-buttons">
        <SuccessButton onClick={onSave}>Lagre</SuccessButton>
      </div>
    </div>
  );
}
