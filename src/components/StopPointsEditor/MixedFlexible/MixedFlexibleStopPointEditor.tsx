import { SecondaryButton, SuccessButton } from '@entur/button';
import { Dropdown } from '@entur/dropdown';
import { Radio, RadioGroup } from '@entur/form';
import { Paragraph } from '@entur/typography';
import BookingArrangementEditor from 'components/BookingArrangementEditor';
import { BookingInfoAttachmentType } from 'components/BookingArrangementEditor/constants';
import ConfirmDialog from 'components/ConfirmDialog';
import DeleteButton from 'components/DeleteButton/DeleteButton';
import { mapToItems } from 'helpers/dropdown';
import { getErrorFeedback } from 'helpers/errorHandling';
import { validateStopPoint } from 'helpers/validation';
import usePristine from 'hooks/usePristine';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { GlobalState } from 'reducers';
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

enum StopPlaceMode {
  NSR = 'nsr',
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
}: StopPointEditorProps) => {
  const { formatMessage } = useIntl();
  const [selectMode, setSelectMode] = useState<StopPlaceMode>(
    stopPoint.quayRef ? StopPlaceMode.NSR : StopPlaceMode.FLEXIBLE
  );
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const flexibleStopPlaces = useSelector(
    (state: GlobalState) => state.flexibleStopPlaces
  );

  const quayRefPristine = usePristine(stopPoint.quayRef, spoilPristine);

  const stopPlacePristine = usePristine(
    stopPoint.flexibleStopPlaceRef,
    spoilPristine
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

  return (
    <div className="stop-point">
      <div className="stop-point-element">
        <div className="stop-point-key-info">
          <Paragraph>{order}</Paragraph>
          <RadioGroup
            name={`stopPointMode-${order! - 1}`}
            value={selectMode}
            onChange={(e) => {
              setSelectMode(e.target.value as StopPlaceMode);
              onChange({
                ...stopPoint,
                quayRef: null,
                flexibleStopPlaceRef: null,
                flexibleStopPlace: undefined,
              });
            }}
          >
            <div className="radio-buttons">
              <Radio value={StopPlaceMode.FLEXIBLE}>
                {formatMessage({ id: 'selectCustom' })}
              </Radio>
              <Radio value={StopPlaceMode.NSR}>
                {formatMessage({ id: 'selectNsr' })}
              </Radio>
            </div>
          </RadioGroup>
        </div>
        <div className="stop-point-info">
          {selectMode === StopPlaceMode.FLEXIBLE && (
            <Dropdown
              className="stop-point-dropdown"
              value={stopPoint.flexibleStopPlaceRef}
              placeholder={formatMessage({ id: 'defaultOption' })}
              items={mapToItems(flexibleStopPlaces || [])}
              clearable
              label={formatMessage({ id: 'stopPlace' })}
              onChange={(e) =>
                onChange({
                  ...stopPoint,
                  flexibleStopPlaceRef: e?.value,
                })
              }
              {...getErrorFeedback(
                stopPlaceError ? formatMessage({ id: stopPlaceError }) : '',
                !stopPlaceError,
                stopPlacePristine
              )}
            />
          )}

          {selectMode === StopPlaceMode.NSR && (
            <QuayRefField
              initialQuayRef={stopPoint.quayRef}
              errorFeedback={getErrorFeedback(
                stopPlaceError ? formatMessage({ id: stopPlaceError }) : '',
                !stopPlaceError,
                quayRefPristine
              )}
              onChange={onQuayRefChange}
            />
          )}

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
