import { SecondaryButton, SuccessButton } from '@entur/button';
import { Dropdown } from '@entur/dropdown';
import { Radio, RadioGroup } from '@entur/form';
import BookingArrangementEditor from 'components/BookingArrangementEditor';
import { BookingInfoAttachmentType } from 'components/BookingArrangementEditor/constants';
import ConfirmDialog from 'components/ConfirmDialog';
import DeleteButton from 'components/DeleteButton/DeleteButton';
import { mapToItems } from 'helpers/dropdown';
import { getErrorFeedback } from 'helpers/errorHandling';
import { validateStopPoint } from 'helpers/validation';
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
    <div className="stop-point">
      <div className="stop-point-element">
        <div className="stop-point-key-info stop-point-key-info--flexible">
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
            <div className="radio-buttons">
              <Radio value={StopPlaceMode.FLEXIBLE}>
                {formatMessage({ id: 'selectCustom' })}
              </Radio>
              <Radio value={StopPlaceMode.EXTERNAL}>
                {formatMessage({ id: 'selectNsr' })}
              </Radio>
            </div>
          </RadioGroup>
        </div>
        <div className="stop-point-info">
          {selectMode === StopPlaceMode.FLEXIBLE && (
            <Dropdown
              className="stop-point-dropdown"
              selectedItem={{
                value: stopPoint.flexibleStopPlaceRef,
                label:
                  flexibleStopPlaces?.find(
                    (item) => item.id === stopPoint.flexibleStopPlaceRef,
                  )?.name || '',
              }}
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
              noMatchesText={formatMessage({
                id: 'dropdownNoMatchesText',
              })}
              {...getErrorFeedback(
                stopPlaceError ? formatMessage({ id: stopPlaceError }) : '',
                !stopPlaceError,
                stopPlacePristine,
              )}
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
