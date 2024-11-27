import { IconButton, SecondaryButton, SuccessButton } from '@entur/button';
import { Paragraph } from '@entur/typography';
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
import { StopPointEditorProps } from '../common/StopPointEditorProps';
import SandboxFeature from '../../../ext/SandboxFeature';
import { BackArrowIcon } from '@entur/icons';

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
}: StopPointEditorProps) => {
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
        <div className="stop-point-key-info">
          {!isFirst && (
            <IconButton
              onClick={() => swapStopPoints(order - 2, order - 1)}
              className={'move-up'}
              size={'small'}
            >
              <BackArrowIcon />
            </IconButton>
          )}

          <Paragraph>{order}</Paragraph>
          {!isLast && (
            <IconButton
              onClick={() => swapStopPoints(order - 1, order)}
              className={'move-down'}
              size={'small'}
            >
              <BackArrowIcon />
            </IconButton>
          )}
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

        <SandboxFeature
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
          stopPoint={stopPoint}
          onDeleteDialogOpen={onDeleteDialogOpen}
          flexibleLineType={flexibleLineType}
          onFocusedQuayIdUpdate={onFocusedQuayIdUpdate}
          canDelete={canDelete}
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
