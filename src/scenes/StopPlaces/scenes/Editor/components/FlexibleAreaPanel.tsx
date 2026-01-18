import { SecondaryButton, PrimaryButton } from '@entur/button';
import { ExpandablePanel } from '@entur/expand';
import { MapIcon } from '@entur/icons';
import FlexibleArea from 'model/FlexibleArea';
import { KeyValues } from 'model/KeyValues';
import { useIntl } from 'react-intl';
import { CoordinatesInputField } from './CoordinatesInputField';
import { StopPlaceTypeDropdown } from './StopPlaceTypeDropdown';
import { Coordinate } from 'model/GeoJSON';

type Props = {
  area: FlexibleArea;
  index: number;
  isOpen: boolean;
  canDelete: boolean;
  onToggle: () => void;
  onKeyValuesUpdate: (keyValues: KeyValues[]) => void;
  onRemove: () => void;
  onDrawPolygonClick: () => void;
  coordinates: Coordinate[];
  onCoordinatesChange: (coordinates: Coordinate[]) => void;
};

const FlexibleAreaPanel = ({
  area,
  index,
  isOpen,
  canDelete,
  onToggle,
  onKeyValuesUpdate,
  onRemove,
  onDrawPolygonClick,
  coordinates,
  onCoordinatesChange,
}: Props) => {
  const { formatMessage } = useIntl();

  return (
    <ExpandablePanel
      title={`${formatMessage({ id: 'stopPlaceAreaLabelPrefix' })} ${index + 1}`}
      open={isOpen}
      onToggle={onToggle}
    >
      <div className="stop-place-form">
        <StopPlaceTypeDropdown
          label={formatMessage({ id: 'flexibleStopAreaType' })}
          keyValues={area.keyValues}
          keyValuesUpdate={onKeyValuesUpdate}
        />

        <CoordinatesInputField
          coordinates={coordinates}
          changeCoordinates={onCoordinatesChange}
        />

        <PrimaryButton
          className="draw-polygon-button"
          onClick={onDrawPolygonClick}
        >
          {formatMessage({ id: 'editorDrawPolygonButtonText' })}
          <MapIcon />
        </PrimaryButton>

        <SecondaryButton disabled={!canDelete} onClick={onRemove}>
          {formatMessage({ id: 'stopPlaceRemoveAreaButtonLabel' })}
        </SecondaryButton>
      </div>
    </ExpandablePanel>
  );
};

export default FlexibleAreaPanel;
