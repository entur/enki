import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Map from '@mui/icons-material/Map';
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
    <Accordion expanded={isOpen} onChange={onToggle}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>{`${formatMessage({ id: 'stopPlaceAreaLabelPrefix' })} ${index + 1}`}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div>
          <StopPlaceTypeDropdown
            label={formatMessage({ id: 'flexibleStopAreaType' })}
            keyValues={area.keyValues}
            keyValuesUpdate={onKeyValuesUpdate}
          />

          <CoordinatesInputField
            coordinates={coordinates}
            changeCoordinates={onCoordinatesChange}
          />

          <Button variant="contained" onClick={onDrawPolygonClick}>
            {formatMessage({ id: 'editorDrawPolygonButtonText' })}
            <Map />
          </Button>

          <Button variant="outlined" disabled={!canDelete} onClick={onRemove}>
            {formatMessage({ id: 'stopPlaceRemoveAreaButtonLabel' })}
          </Button>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default FlexibleAreaPanel;
