import { Dropdown } from '@entur/dropdown';
import BookingArrangementEditor from 'components/BookingArrangementEditor';
import { BookingInfoAttachmentType } from 'components/BookingArrangementEditor/constants';
import { mapToItems } from 'helpers/dropdown';
import { getErrorFeedback } from 'helpers/errorHandling';
import { validateFlexibleAreasOnlyStopPoint } from 'helpers/validation';
import usePristine from 'hooks/usePristine';
import { useIntl } from 'react-intl';
import { useAppSelector } from '../../../store/hooks';
import {
  FrontTextTextField,
  useOnFrontTextChange,
} from '../common/FrontTextTextField';
import { StopPointEditorProps } from '../common/StopPointEditorProps';

export const FlexibleAreasOnlyStopPointEditor = ({
  stopPoint,
  onChange,
  spoilPristine,
}: StopPointEditorProps) => {
  const { stopPlace: stopPlaceError, frontText: frontTextError } =
    validateFlexibleAreasOnlyStopPoint(stopPoint);
  const { formatMessage } = useIntl();
  const flexibleStopPlaces = useAppSelector(
    (state) => state.flexibleStopPlaces,
  );
  const onFrontTextChange = useOnFrontTextChange(stopPoint, onChange);
  const stopPlacePristine = usePristine(
    stopPoint.flexibleStopPlaceRef,
    spoilPristine,
  );
  const frontTextPristine = usePristine(
    stopPoint.destinationDisplay?.frontText,
    spoilPristine,
  );

  return (
    <div className="stop-point">
      <div className="stop-point-element">
        <div className="stop-point-info">
          <Dropdown<string>
            className="stop-point-dropdown"
            selectedItem={
              mapToItems(
                flexibleStopPlaces?.filter(
                  (item) => item.id === stopPoint.flexibleStopPlaceRef,
                ) || [],
              ).pop() || null
            }
            placeholder={formatMessage({ id: 'defaultOption' })}
            items={mapToItems(flexibleStopPlaces || [])}
            clearable
            labelClearSelectedItem={formatMessage({ id: 'clearSelected' })}
            label={formatMessage({ id: 'stopPlace' })}
            onChange={(e) =>
              onChange({
                ...stopPoint,
                flexibleStopPlaceRef: e?.value,
              })
            }
            noMatchesText={formatMessage({
              id: 'dropdownNoMatchesText',
            })}
            {...getErrorFeedback(
              stopPlaceError ? formatMessage({ id: stopPlaceError }) : '',
              !stopPlaceError,
              stopPlacePristine,
            )}
          />

          <FrontTextTextField
            value={stopPoint.destinationDisplay?.frontText}
            onChange={onFrontTextChange}
            spoilPristine={spoilPristine}
            {...getErrorFeedback(
              frontTextError ? formatMessage({ id: frontTextError }) : '',
              !frontTextError,
              frontTextPristine,
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
