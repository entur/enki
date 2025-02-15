import { SecondaryButton, SuccessButton } from '@entur/button';
import BookingArrangementEditor from 'components/BookingArrangementEditor';
import { BookingInfoAttachmentType } from 'components/BookingArrangementEditor/constants';
import ConfirmDialog from 'components/ConfirmDialog';
import DeleteButton from 'components/DeleteButton/DeleteButton';
import { getErrorFeedback } from 'helpers/errorHandling';
import { validateStopPoint } from 'helpers/validation';
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
    <div className="stop-point">
      <div className="stop-point-element">
        <div className="stop-point-key-info stop-point-key-info--general">
          <StopPointOrder
            order={order}
            isLast={isLast}
            isFirst={isFirst}
            swapStopPoints={
              swapStopPoints as (pos1: number, pos2: number) => void
            }
          />
        </div>
        <div className="stop-point-info">
          <QuayRefField
            initialQuayRef={stopPoint.quayRef}
            errorFeedback={getErrorFeedback(
              stopPlaceError ? formatMessage({ id: stopPlaceError }) : '',
              !stopPlaceError,
              quayRefPristine,
            )}
            onChange={onQuayRefChange}
          />

          <FrontTextTextField
            value={stopPoint.destinationDisplay?.frontText}
            onChange={onFrontTextChange}
            disabled={isLast}
            spoilPristine={spoilPristine}
            frontTextError={frontTextError}
          />

          <BoardingTypeSelect
            boardingType={selectedBoardingType}
            onChange={onBoardingTypeChange}
            error={boardingError}
          />
        </div>

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

        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          title={formatMessage({ id: 'deleteStopPointDialogTitle' })}
          message={formatMessage({ id: 'deleteStopPointDialogMessage' })}
          buttons={[
            <SecondaryButton
              key="no"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {formatMessage({ id: 'no' })}
            </SecondaryButton>,
            <SuccessButton key="yes" onClick={onDelete}>
              {formatMessage({ id: 'yes' })}
            </SuccessButton>,
          ]}
          onDismiss={() => setDeleteDialogOpen(false)}
        />
      </div>

      {flexibleLineType && (
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
      )}
    </div>
  );
};
