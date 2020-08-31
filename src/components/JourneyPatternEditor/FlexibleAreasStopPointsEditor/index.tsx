import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { InputGroup, TextField } from '@entur/form';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import StopPoint from 'model/StopPoint';
import { Dropdown } from '@entur/dropdown';
import usePristine from 'hooks/usePristine';
import { getErrorFeedback } from 'helpers/errorHandling';
import { AppIntlState, selectIntl } from 'i18n';
import { isBlank } from 'helpers/forms';
import { GlobalState } from 'reducers';
import { getInit, mapToItems } from 'helpers/dropdown';
import './styles.scss';
import BookingArrangementEditor from 'components/BookingArrangementEditor';
import { BookingInfoAttachmentType } from 'components/BookingArrangementEditor/constants';

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
  const stopPointValue = stopPoint.flexibleStopPlaceRef;

  const frontText = stopPoints[0].destinationDisplay?.frontText;
  const stopPlacePristine = usePristine(stopPointValue, spoilPristine);
  const frontTextPristine = usePristine(frontText, spoilPristine);

  const stopPointChange = ({
    bookingArrangement,
    ...newStopPoint
  }: StopPoint) => {
    updateStopPoints([
      {
        ...newStopPoint,
        bookingArrangement,
        forBoarding: true,
        forAlighting: false,
      },
      {
        ...newStopPoint,
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
          initialSelectedItem={getInit(flexibleStopPlaces, stopPointValue)}
          placeholder={formatMessage('defaultOption')}
          items={mapToItems(flexibleStopPlaces)}
          clearable
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
        label={formatMessage('labelFrontTextRequired')}
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
      <BookingArrangementEditor
        bookingArrangement={stopPoint.bookingArrangement}
        spoilPristine={spoilPristine}
        bookingInfoAttachment={{
          type: BookingInfoAttachmentType.STOP_POINT_IN_JOURNEYPATTERN,
          name: stopPoint.flexibleStopPlace?.name!,
        }}
        onChange={(bookingArrangement) => {
          stopPointChange({
            ...stopPoint,
            bookingArrangement,
          });
        }}
        onRemove={() => {
          const { bookingArrangement, ...rest } = stopPoint;
          stopPointChange({
            ...rest,
          });
        }}
      />
    </div>
  );
};

export default FlexibleAreasOnlyEditor;
