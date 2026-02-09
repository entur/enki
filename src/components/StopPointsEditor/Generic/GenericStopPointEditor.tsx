import { Box } from '@mui/material';
import { DeleteStopPointDialog } from '../common/DeleteStopPointDialog';
import { StopPointBookingArrangement } from '../common/StopPointBookingArrangement';
import DeleteButton from 'components/DeleteButton/DeleteButton';
import { getErrorFeedback } from 'helpers/errorHandling';
import { validateStopPoint } from 'validation';
import usePristine from 'hooks/usePristine';
import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
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
import { GenericStopPointEditorProps } from '../common/StopPointEditorProps';
import StopPointOrder from '../common/StopPointOrder';
import { ComponentToggle } from '@entur/react-component-toggle';
import { StopPointButtonGroupProps } from '../../../ext/JourneyPatternStopPointMap/StopPointButtonGroup/types';
import { SandboxFeatures } from '../../../config/config';

export const GenericStopPointEditor = ({
  order,
  stopPoint,
  spoilPristine,
  isFirst,
  isLast,
  onChange,
  onDelete,
  canDelete,
  flexibleLineType,
  onFocusedQuayIdUpdate,
  swapStopPoints,
  stopPlacesInJourneyPattern,
  updateStopPlacesInJourneyPattern,
}: GenericStopPointEditorProps) => {
  const { formatMessage } = useIntl();
  const {
    stopPlace: stopPlaceError,
    boarding: boardingError,
    frontText: frontTextError,
  } = validateStopPoint(stopPoint, isFirst!, isLast!);
  const quayRefPristine = usePristine(stopPoint.quayRef, spoilPristine);

  const onQuayRefChange = useOnQuayRefChange(stopPoint, onChange);
  const onFrontTextChange = useOnFrontTextChange(stopPoint, onChange);
  const selectedBoardingType = useSelectedBoardingType(stopPoint);
  const onBoardingTypeChange = useOnBoardingTypeChange(stopPoint, onChange);

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const onDeleteDialogOpen = useCallback((isOpen: boolean) => {
    setDeleteDialogOpen(isOpen);
  }, []);

  return (
    <Box sx={{ borderBottom: 2, borderColor: 'divider', pb: 2 }}>
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
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            flexGrow: 1,
            mx: 2,
          }}
        >
          <QuayRefField
            initialQuayRef={stopPoint.quayRef}
            errorFeedback={getErrorFeedback(
              stopPlaceError ? formatMessage({ id: stopPlaceError }) : '',
              !stopPlaceError,
              quayRefPristine,
            )}
            onChange={onQuayRefChange}
            updateStopPlacesInJourneyPattern={updateStopPlacesInJourneyPattern}
            alreadyFetchedStopPlaces={stopPlacesInJourneyPattern}
          />

          <FrontTextTextField
            value={stopPoint.destinationDisplay?.frontText}
            onChange={onFrontTextChange}
            disabled={isLast}
            spoilPristine={spoilPristine}
            frontTextError={frontTextError}
            isFirst={isFirst}
          />

          <BoardingTypeSelect
            boardingType={selectedBoardingType}
            onChange={onBoardingTypeChange}
            error={boardingError}
          />
        </Box>

        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <ComponentToggle<SandboxFeatures, StopPointButtonGroupProps>
            feature={'JourneyPatternStopPointMap/StopPointButtonGroup'}
            renderFallback={() => (
              <DeleteButton
                thin={true}
                disabled={!canDelete}
                onClick={() => {
                  onDeleteDialogOpen(true);
                }}
                title={formatMessage({ id: 'editorDeleteButtonText' })}
              />
            )}
            componentProps={{
              stopPoint,
              onDeleteDialogOpen,
              flexibleLineType,
              onFocusedQuayIdUpdate,
              canDelete,
            }}
          />
        </Box>

        <DeleteStopPointDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={onDelete!}
        />
      </Box>

      {flexibleLineType && (
        <StopPointBookingArrangement
          stopPoint={stopPoint}
          spoilPristine={spoilPristine}
          onChange={onChange}
        />
      )}
    </Box>
  );
};
