import { SecondaryButton, SuccessButton } from '@entur/button';
import { Paragraph } from '@entur/typography';
import ConfirmDialog from 'components/ConfirmDialog';
import DeleteButton from 'components/DeleteButton/DeleteButton';
import { getErrorFeedback } from 'helpers/errorHandling';
import { validateStopPoint } from 'helpers/validation';
import usePristine from 'hooks/usePristine';
import { AppIntlState, selectIntl } from 'i18n';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { GlobalState } from 'reducers';
import { StopPointEditorProps } from '../common/StopPointEditorProps';
import {
  FrontTextTextField,
  useOnFrontTextChange,
} from '../common/FrontTextTextField';
import { QuayRefField, useOnQuayRefChange } from '../common/QuayRefField';
import {
  BoardingTypeSelect,
  useOnBoardingTypeChange,
  useSelectedBoardingType,
} from '../common/BoardingTypeSelect';
import BookingArrangementEditor from 'components/BookingArrangementEditor';
import { BookingInfoAttachmentType } from 'components/BookingArrangementEditor/constants';

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
}: StopPointEditorProps) => {
  const { formatMessage } = useSelector<GlobalState, AppIntlState>(selectIntl);
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

  return (
    <div className="stop-point">
      <div className="stop-point-element">
        <div className="stop-point-key-info">
          <Paragraph>{order}</Paragraph>
        </div>
        <div className="stop-point-info">
          <QuayRefField
            initialQuayRef={stopPoint.quayRef}
            errorFeedback={getErrorFeedback(
              stopPlaceError ? formatMessage(stopPlaceError) : '',
              !stopPlaceError,
              quayRefPristine
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

        <DeleteButton
          disabled={!canDelete}
          onClick={() => setDeleteDialogOpen(true)}
          title={formatMessage('editorDeleteButtonText')}
        />

        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          title={formatMessage('deleteStopPointDialogTitle')}
          message={formatMessage('deleteStopPointDialogMessage')}
          buttons={[
            <SecondaryButton
              key="no"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {formatMessage('no')}
            </SecondaryButton>,
            <SuccessButton key="yes" onClick={onDelete}>
              {formatMessage('yes')}
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
