import './styles.scss';
import { FloatingButton } from '@entur/button';
import { UndoIcon } from '@entur/icons';
import DefaultMapContainer from './DefaultMapContainer';
import React from 'react';
import { useConfig } from '../../config/ConfigContext';
import FintrafficMapProvider from '../../ext/Fintraffic/CustomMapProvider';

type Props = {
  undo?: () => void;
  children: React.ReactElement;
};

const FormMap = (props: Props) => {
  const { extPath, sandboxFeatures } = useConfig();
  return (
    <div className="map-container eds-contrast">
      {sandboxFeatures?.Fintraffic ? (
        <FintrafficMapProvider>{props.children}</FintrafficMapProvider>
      ) : (
        <DefaultMapContainer>{props.children}</DefaultMapContainer>
      )}
      {/*<SandboxFeature
        feature={`${extPath}/CustomMapProvider`}
        renderFallback={() => <DefaultMapContainer>{props.children}</DefaultMapContainer>}
      >
        {props.children}
      </SandboxFeature>*/}

      {props.undo ? (
        <FloatingButton
          className="undo-button"
          size="small"
          aria-label="Undo"
          onClick={props.undo}
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
