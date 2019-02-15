import React from 'react';
import {Button} from '@entur/component-library';

export default function Header ({isEditMode, onSave}) {
  return (
    <div className="header">
      <h2>{isEditMode ? 'Rediger' : 'Opprett'} Stoppepunkt</h2>

      <div className="header-buttons">
        <Button variant="success" onClick={onSave}>
          Lagre
        </Button>
      </div>
    </div>
  );
}
