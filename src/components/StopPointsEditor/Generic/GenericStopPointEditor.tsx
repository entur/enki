import { SecondaryButton, SuccessButton } from '@entur/button';
import { Paragraph } from '@entur/typography';
import BookingArrangementEditor from 'components/BookingArrangementEditor';
import { BookingInfoAttachmentType } from 'components/BookingArrangementEditor/constants';
import ConfirmDialog from 'components/ConfirmDialog';
import DeleteButton from 'components/DeleteButton/DeleteButton';
import { getErrorFeedback } from 'helpers/errorHandling';
import { validateStopPoint } from 'helpers/validation';
import usePristine from 'hooks/usePristine';
import { useState } from 'react';
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
              stopPlaceError ? formatMessage({ id: stopPlaceError }) : '',
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
          title={formatMessage({ id: 'editorDeleteButtonText' })}
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
