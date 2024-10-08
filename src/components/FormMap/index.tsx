import './styles.scss';
import { FloatingButton } from '@entur/button';
import { UndoIcon } from '@entur/icons';
import DefaultMapContainer from './DefaultMapContainer';
import React from 'react';
import { useConfig } from '../../config/ConfigContext';
import SandboxFeature from '../../ext/SandboxFeature';

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
      <SandboxFeature
        feature={`${extPath}/CustomMapProvider`}
        zoomControl={zoomControl}
        doubleClickZoom={doubleClickZoom}
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
      </SandboxFeature>

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
