import { Autocomplete, TextField } from '@mui/material';
import { NormalizedDropdownItemType } from 'helpers/dropdown';
import BookingArrangementEditor from 'components/BookingArrangementEditor';
import { BookingInfoAttachmentType } from 'components/BookingArrangementEditor/constants';
import { mapToItems } from 'helpers/dropdown';
import { getErrorFeedback } from 'helpers/errorHandling';
import { validateFlexibleAreasOnlyStopPoint } from 'validation';
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
    <div style={{ borderBottom: '2px solid #d9d9d9' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '1.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            maxWidth: '50rem',
            flexBasis: '100%',
            marginLeft: '1rem',
            marginRight: '1rem',
          }}
        >
          <Autocomplete
            value={
              mapToItems(flexibleStopPlaces || []).find(
                (item) => item.value === stopPoint.flexibleStopPlaceRef,
              ) || null
            }
            onChange={(_event, newValue: NormalizedDropdownItemType | null) =>
              onChange({
                ...stopPoint,
                flexibleStopPlaceRef: newValue?.value,
              })
            }
            options={mapToItems(flexibleStopPlaces || [])}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            noOptionsText={formatMessage({
              id: 'dropdownNoMatchesText',
            })}
            renderInput={(params) => {
              const hasError = !stopPlacePristine && !!stopPlaceError;
              return (
                <TextField
                  {...params}
                  label={formatMessage({ id: 'stopPlace' })}
                  placeholder={formatMessage({ id: 'defaultOption' })}
                  error={hasError}
                  helperText={
                    hasError ? formatMessage({ id: stopPlaceError }) : ''
                  }
                />
              );
            }}
          />

          <FrontTextTextField
            value={stopPoint.destinationDisplay?.frontText}
            onChange={onFrontTextChange}
            spoilPristine={spoilPristine}
            isFirst={true}
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
