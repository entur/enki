import './styles.scss';
import { Fab } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
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
        <Fab
          className="undo-button"
          size="small"
          aria-label="Undo"
          onClick={undo}
        >
          <UndoIcon />
        </Fab>
      ) : (
        ''
      )}
    </div>
  );
};

export default FormMap;
