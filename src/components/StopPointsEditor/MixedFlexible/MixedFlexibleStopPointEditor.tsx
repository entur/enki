import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { NormalizedDropdownItemType } from 'helpers/dropdown';
import BookingArrangementEditor from 'components/BookingArrangementEditor';
import { BookingInfoAttachmentType } from 'components/BookingArrangementEditor/constants';
import ConfirmDialog from 'components/ConfirmDialog';
import DeleteButton from 'components/DeleteButton/DeleteButton';
import { mapToItems } from 'helpers/dropdown';
import { getErrorFeedback } from 'helpers/errorHandling';
import { validateStopPoint } from 'validation';
import usePristine from 'hooks/usePristine';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useAppSelector } from '../../../store/hooks';
import {
  BoardingTypeSelect,
  useOnBoardingTypeChange,
  useSelectedBoardingType,
} from '../common/BoardingTypeSelect';
import {
  FrontTextTextField,
  useOnFrontTextChange,
} from '../common/FrontTextTextField';
import { QuayRefField, useOnQuayRefChange } from '../common/QuayRefField';
import { MixedFlexibleStopPointEditorProps } from '../common/StopPointEditorProps';
import StopPointOrder from '../common/StopPointOrder';
import StopPoint from '../../../model/StopPoint';

enum StopPlaceMode {
  EXTERNAL = 'external',
  FLEXIBLE = 'flexible',
}

export const MixedFlexibleStopPointEditor = ({
  order,
  stopPoint,
  spoilPristine,
  isFirst,
  isLast,
  onChange,
  onDelete,
  canDelete,
  swapStopPoints,
}: MixedFlexibleStopPointEditorProps) => {
  const { formatMessage } = useIntl();
  const [selectMode, setSelectMode] = useState<StopPlaceMode>(
    stopPoint.quayRef ? StopPlaceMode.EXTERNAL : StopPlaceMode.FLEXIBLE,
  );
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const flexibleStopPlaces = useAppSelector(
    (state) => state.flexibleStopPlaces,
  );

  const quayRefPristine = usePristine(stopPoint.quayRef, spoilPristine);

  const stopPlacePristine = usePristine(
    stopPoint.flexibleStopPlaceRef,
    spoilPristine,
  );

  const onQuayRefChange = useOnQuayRefChange(stopPoint, onChange);
  const onFrontTextChange = useOnFrontTextChange(stopPoint, onChange);
  const selectedBoardingType = useSelectedBoardingType(stopPoint);
  const onBoardingTypeChange = useOnBoardingTypeChange(stopPoint, onChange);

  const {
    stopPlace: stopPlaceError,
    boarding: boardingError,
    frontText: frontTextError,
  } = validateStopPoint(stopPoint, isFirst!, isLast!);

  useEffect(() => {
    // Stop point's mode (external or flexible) can change when reordering
    const stopPointObjectKeys = Object.keys(stopPoint);
    const modeWasChangedToExternal = stopPointObjectKeys.includes('quayRef');
    const modeWasChangedToFlexible = stopPointObjectKeys.includes(
      'flexibleStopPlaceRef',
    );

    if (modeWasChangedToExternal && selectMode === StopPlaceMode.FLEXIBLE) {
      setSelectMode(StopPlaceMode.EXTERNAL);
    } else if (
      modeWasChangedToFlexible &&
      selectMode === StopPlaceMode.EXTERNAL
    ) {
      setSelectMode(StopPlaceMode.FLEXIBLE);
    }
  }, [stopPoint.key]);

  return (
    <Box sx={{ borderBottom: 2, borderColor: 'divider' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 3,
        }}
      >
        <Box sx={{ minWidth: 'fit-content', display: 'flex' }}>
          <StopPointOrder
            order={order}
            isLast={isLast}
            isFirst={isFirst}
            swapStopPoints={
              swapStopPoints as (pos1: number, pos2: number) => void
            }
          />
          <RadioGroup
            name={`stopPointMode-${order! - 1}`}
            value={selectMode}
            onChange={(e) => {
              setSelectMode(e.target.value as StopPlaceMode);
              const newStopPoint: StopPoint = {
                ...stopPoint,
                quayRef: null,
                flexibleStopPlaceRef: null,
                flexibleStopPlace: undefined,
              };
              if (
                (e.target.value as StopPlaceMode) === StopPlaceMode.EXTERNAL
              ) {
                delete newStopPoint['flexibleStopPlaceRef'];
                delete newStopPoint['flexibleStopPlace'];
              } else {
                delete newStopPoint['quayRef'];
              }
              onChange(newStopPoint);
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <FormControlLabel
                value={StopPlaceMode.FLEXIBLE}
                control={<Radio />}
                label={formatMessage({ id: 'selectCustom' })}
              />
              <FormControlLabel
                value={StopPlaceMode.EXTERNAL}
                control={<Radio />}
                label={formatMessage({ id: 'selectNsr' })}
              />
            </Box>
          </RadioGroup>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            maxWidth: '50rem',
            flexBasis: '100%',
          }}
        >
          {selectMode === StopPlaceMode.FLEXIBLE && (
            <Autocomplete
              sx={{ flex: 1, minWidth: 200 }}
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
          )}

          {selectMode === StopPlaceMode.EXTERNAL && (
            <QuayRefField
              initialQuayRef={stopPoint.quayRef}
              errorFeedback={getErrorFeedback(
                stopPlaceError ? formatMessage({ id: stopPlaceError }) : '',
                !stopPlaceError,
                quayRefPristine,
              )}
              onChange={onQuayRefChange}
            />
          )}

          <Box sx={{ flex: 1, minWidth: 200 }}>
            <FrontTextTextField
              value={stopPoint.destinationDisplay?.frontText}
              onChange={onFrontTextChange}
              disabled={isLast}
              spoilPristine={spoilPristine}
              frontTextError={frontTextError}
              isFirst={isFirst}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 200 }}>
            <BoardingTypeSelect
              boardingType={selectedBoardingType}
              onChange={onBoardingTypeChange}
              error={boardingError}
            />
          </Box>
        </Box>
        <DeleteButton
          disabled={!canDelete}
          onClick={() => setDeleteDialogOpen(true)}
          title={formatMessage({ id: 'editorDeleteButtonText' })}
        />

        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          title={formatMessage({ id: 'deleteStopPointDialogTitle' })}
          message={formatMessage({ id: 'deleteStopPointDialogMessage' })}
          buttons={[
            <Button
              key="no"
              variant="outlined"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {formatMessage({ id: 'no' })}
            </Button>,
            <Button
              key="yes"
              variant="contained"
              color="success"
              onClick={onDelete}
            >
              {formatMessage({ id: 'yes' })}
            </Button>,
          ]}
          onDismiss={() => setDeleteDialogOpen(false)}
        />
      </Box>
      <Box>
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
      </Box>
    </Box>
  );
};
