import './styles.scss';
import { FloatingButton } from '@entur/button';
import { UndoIcon } from '@entur/icons';
import React from 'react';
import FormMapContainer from './FormMapContainer';

type Props = {
  undo?: () => void;
  children: React.ReactElement;
  zoomControl?: boolean;
  doubleClickZoom?: boolean;
};

const FormMap = ({
  undo,
  children,
  zoomControl,
  doubleClickZoom = true,
}: Props) => {
  return (
    <div className="map-container eds-contrast">
      <FormMapContainer
        zoomControl={zoomControl}
        doubleClickZoom={doubleClickZoom}
      >
        {children}
      </FormMapContainer>

      {undo ? (
        <FloatingButton
          className="undo-button"
          size="small"
          aria-label="Undo"
          onClick={undo}
        >
          <UndoIcon />
        </FloatingButton>
      ) : (
        ''
      )}
    </div>
  );
};

export default FormMap;
