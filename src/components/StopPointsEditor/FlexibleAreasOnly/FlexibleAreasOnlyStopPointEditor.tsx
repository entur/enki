import { Dropdown } from '@entur/dropdown';
import { mapToItems } from 'helpers/dropdown';
import { getErrorFeedback } from 'helpers/errorHandling';
import { validateFlexibleAreasOnlyStopPoint } from 'helpers/validation';
import usePristine from 'hooks/usePristine';
import { selectIntl } from 'i18n';
import React from 'react';
import { useSelector } from 'react-redux';
import { GlobalState } from 'reducers';
import { StopPointEditorProps } from '../common/StopPointEditorProps';
import {
  FrontTextTextField,
  useOnFrontTextChange,
} from '../common/FrontTextTextField';
import BookingArrangementEditor from 'components/BookingArrangementEditor';
import { BookingInfoAttachmentType } from 'components/BookingArrangementEditor/constants';

export const FlexibleAreasOnlyStopPointEditor = ({
  stopPoint,
  onChange,
  spoilPristine,
}: StopPointEditorProps) => {
  console.log('FlexibleAreasOnlyStopPointEditor');
  const { stopPlace: stopPlaceError, frontText: frontTextError } =
    validateFlexibleAreasOnlyStopPoint(stopPoint);
  const { formatMessage } = useSelector(selectIntl);
  const flexibleStopPlaces = useSelector(
    (state: GlobalState) => state.flexibleStopPlaces
  );
  const onFrontTextChange = useOnFrontTextChange(stopPoint, onChange);
  const stopPlacePristine = usePristine(
    stopPoint.flexibleStopPlaceRef,
    spoilPristine
  );
  const frontTextPristine = usePristine(
    stopPoint.destinationDisplay?.frontText,
    spoilPristine
  );

  return (
    <div className="stop-point">
      <div className="stop-point-element">
        <div className="stop-point-info">
          <Dropdown
            className="stop-point-dropdown"
            value={stopPoint.flexibleStopPlaceRef}
            placeholder={formatMessage('defaultOption')}
            items={mapToItems(flexibleStopPlaces || [])}
            clearable
            label={formatMessage('stopPlace')}
            onChange={(e) =>
              onChange({
                ...stopPoint,
                flexibleStopPlaceRef: e?.value,
              })
            }
            {...getErrorFeedback(
              stopPlaceError ? formatMessage(stopPlaceError) : '',
              !stopPlaceError,
              stopPlacePristine
            )}
          />

          <FrontTextTextField
            value={stopPoint.destinationDisplay?.frontText}
            onChange={onFrontTextChange}
            spoilPristine={spoilPristine}
            {...getErrorFeedback(
              frontTextError ? formatMessage(frontTextError) : '',
              !frontTextError,
              frontTextPristine
            )}
          />
        </div>
      </div>
      <div>
        <BookingArrangementEditor
          trim
          bookingArrangement={stopPoint.bookingArrangement}
          spoilPristine={spoilPristine}
          bookingInfoAttachment={{
            type: BookingInfoAttachmentType.STOP_POINT_IN_JOURNEYPATTERN,
            name: stopPoint.flexibleStopPlace?.name! || stopPoint.quayRef!,
          }}
          onChange={(bookingArrangement) => {
            onChange({
              ...stopPoint,
              bookingArrangement,
            });
          }}
          onRemove={() => {
            onChange({
              ...stopPoint,
              bookingArrangement: null,
            });
          }}
        />
      </div>
    </div>
  );
};
