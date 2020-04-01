import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { InputGroup, TextField } from '@entur/form';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import StopPoint from 'model/StopPoint';
import { Dropdown } from '@entur/dropdown';
import { usePristine } from 'scenes/Lines/scenes/Editor/hooks';
import { getErrorFeedback } from 'helpers/errorHandling';
import { AppIntlState, selectIntl } from 'i18n';
import { isBlank } from 'helpers/forms';
import { GlobalState } from 'reducers';
import './styles.scss';

type Props = {
  flexibleStopPlaces: FlexibleStopPlace[];
  updateStopPoints: (stopPoints: StopPoint[]) => void;
  stopPoints: StopPoint[];
  spoilPristine: boolean;
};
const FlexibleAreasOnlyEditor = (props: Props) => {
  const {
    stopPoints,
    flexibleStopPlaces,
    updateStopPoints,
    spoilPristine,
  } = props;
  const { formatMessage } = useSelector<GlobalState, AppIntlState>(selectIntl);
  const [stopPoint, alightingStopPoint] = stopPoints;
  const stopPointValue =
    stopPoint.flexibleStopPlaceRef ?? stopPoint.flexibleStopPlace?.id;

  const frontText = stopPoints[0].destinationDisplay?.frontText;
  const stopPlacePristine = usePristine(stopPointValue, spoilPristine);
  const frontTextPristine = usePristine(frontText, spoilPristine);

  const stopPointChange = (stopPoint: StopPoint) => {
    updateStopPoints([
      {
        ...stopPoint,
        forBoarding: true,
        forAlighting: false,
      },
      {
        ...stopPoint,
        id: alightingStopPoint?.id,
        forBoarding: false,
        forAlighting: true,
      },
    ]);
  };

  return (
    <div className="flexible-areas-stop-points">
      {
        <Dropdown
          label={formatMessage('stopPlace')}
          value={stopPointValue}
          items={flexibleStopPlaces.map((fsp) => ({
            value: fsp.id,
            label: fsp.name ?? '',
          }))}
          onChange={(e) =>
            stopPointChange({
              ...stopPoint,
              flexibleStopPlaceRef: e?.value,
            })
          }
          {...getErrorFeedback(
            formatMessage('flexibleStopPlaceNoValue'),
            Boolean(stopPointValue),
            stopPlacePristine
          )}
        />
      }

      <InputGroup
        label={formatMessage('labelFrontText')}
        {...getErrorFeedback(
          formatMessage('frontTextNoValue'),
          !isBlank(frontText),
          frontTextPristine
        )}
        labelTooltip={formatMessage('frontTextTooltip')}
      >
        <TextField
          defaultValue={frontText}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            stopPointChange({
              ...stopPoint,
              destinationDisplay: { frontText: e.target.value },
            })
          }
        />
      </InputGroup>
    </div>
  );
};

export default FlexibleAreasOnlyEditor;
