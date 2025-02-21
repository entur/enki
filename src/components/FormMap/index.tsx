import './styles.scss';
import { FloatingButton } from '@entur/button';
import { UndoIcon } from '@entur/icons';
import DefaultMapContainer from './DefaultMapContainer';
import React from 'react';
import { useConfig } from '../../config/ConfigContext';
import { ComponentToggle } from '@entur/react-component-toggle';

type Props = {
  undo?: () => void;
  children: React.ReactElement;
  zoomControl?: boolean;
  doubleClickZoom?: boolean;
};

const FormMap = ({
  undo,
  children,
  zoomControl = true,
  doubleClickZoom = true,
}: Props) => {
  const { extPath } = useConfig();

  return (
    <div className="map-container eds-contrast">
      <ComponentToggle
        feature={`${extPath}/CustomMapProvider`}
        componentProps={{
          zoomControl,
          doubleClickZoom,
        }}
        renderFallback={() => (
          <DefaultMapContainer
            zoomControl={zoomControl}
            doubleClickZoom={doubleClickZoom}
          >
            {children}
          </DefaultMapContainer>
        )}
      >
        {children}
      </ComponentToggle>

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
