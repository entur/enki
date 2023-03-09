import React, { ChangeEvent, useState } from 'react';
import { Radio, RadioGroup, TextField } from '@entur/form';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import StopPoint from 'model/StopPoint';
import { Dropdown } from '@entur/dropdown';
import { Paragraph } from '@entur/typography';
import { SecondaryButton, SuccessButton } from '@entur/button';
import ConfirmDialog from 'components/ConfirmDialog';
import DeleteButton from 'components/DeleteButton/DeleteButton';
import usePristine from 'hooks/usePristine';
import { getErrorFeedback } from 'helpers/errorHandling';
import { AppIntlState, selectIntl } from 'i18n';
import { useSelector } from 'react-redux';
import { GlobalState } from 'reducers';
import { getInit, mapToItems } from 'helpers/dropdown';
import { NormalizedDropdownItemType } from '@entur/dropdown/dist/useNormalizedItems';
import './styles.scss';
import { StopPointsFormError } from 'helpers/validation';
import BookingArrangementEditor from 'components/BookingArrangementEditor';
import { BookingInfoAttachmentType } from 'components/BookingArrangementEditor/constants';
import { QuayRefField } from './QuayRefField';

/** Old usage:
               // <StopPointEditor
              //   key={keys[pointIndex]}
              //   index={pointIndex}
              //   isFirstStop={pointIndex === 0}
              //   isLastStop={pointIndex === pointsInSequence.length - 1}
              //   stopPoint={stopPoint}
              //   errors={validateStopPoint(
              //     stopPoint,
              //     pointIndex === 0,
              //     pointIndex === pointsInSequence.length - 1
              //   )}
              //   deleteStopPoint={
              //     pointsInSequence.length > 2
              //       ? () => deleteStopPoint(pointIndex)
              //       : undefined
              //   }
              //   stopPointChange={(updatedStopPoint: StopPoint) =>
              //     updateStopPoint(pointIndex, updatedStopPoint)
              //   }
              //   flexibleStopPlaces={flexibleStopPlaces}
              //   spoilPristine={spoilPristine}
              //   flexibleLineType={flexibleLineType}
              // />
 */

type StopPlaceMode = 'nsr' | 'custom';

type Props = {
  index: number;
  flexibleStopPlaces: FlexibleStopPlace[];
  errors: StopPointsFormError;
  stopPointChange: (stopPoint: StopPoint) => void;
  stopPoint: StopPoint;
  isFirstStop: boolean;
  isLastStop: boolean;
  deleteStopPoint?: () => void;
  spoilPristine: boolean;
  flexibleLineType: string | undefined;
};

const StopPointEditor = ({
  index,
  flexibleStopPlaces,
  errors,
  stopPointChange,
  stopPoint,
  isFirstStop,
  isLastStop,
  deleteStopPoint,
  spoilPristine,
  flexibleLineType,
}: Props) => {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectMode, setSelectMode] = useState<StopPlaceMode>(
    stopPoint.quayRef || !flexibleLineType ? 'nsr' : 'custom'
  );

  const { formatMessage } = useSelector<GlobalState, AppIntlState>(selectIntl);

  const stopPointValue = stopPoint.flexibleStopPlaceRef;
  const frontTextValue = stopPoint.destinationDisplay?.frontText;

  const stopPlacePristine = usePristine(stopPointValue, spoilPristine);
  const quayRefPristine = usePristine(stopPoint.quayRef, spoilPristine);
  const frontTextPristine = usePristine(frontTextValue, spoilPristine);

  const stopPlaceError = errors.quayRef;
  const frontTextError = errors.frontText;

  const boardingItems = [
    { value: '0', label: formatMessage('labelForBoarding') },
    { value: '1', label: formatMessage('labelForAlighting') },
    {
      value: '2',
      label: formatMessage('labelForBoardingAndAlighting'),
    },
  ];

  const convertBoardingToDropdown = (
    sp: StopPoint
  ): NormalizedDropdownItemType | undefined => {
    if (sp.forBoarding && sp.forAlighting) return boardingItems[2];
    else if (sp.forBoarding) return boardingItems[0];
    else if (sp.forAlighting) return boardingItems[1];
    else return undefined;
  };

  return (
    <div className="stop-point">
      <div className="stop-point-element">
        <div className="stop-point-key-info">
          <Paragraph>{index + 1}</Paragraph>
          {flexibleLineType && flexibleLineType !== 'flexibleAreasOnly' && (
            <RadioGroup
              name={`stopPointMode-${index}`}
              value={selectMode}
              onChange={(e) => {
                setSelectMode(e.target.value as StopPlaceMode);
                stopPointChange({
                  ...stopPoint,
                  quayRef: null,
                  flexibleStopPlaceRef: null,
                  flexibleStopPlace: undefined,
                });
              }}
            >
              <div className="radio-buttons">
                <Radio value="custom">{formatMessage('selectCustom')}</Radio>
                <Radio value="nsr">{formatMessage('selectNsr')}</Radio>
              </div>
            </RadioGroup>
          )}
        </div>
        <div className="stop-point-info">
          {selectMode === 'custom' && (
            <Dropdown
              className="stop-point-dropdown"
              initialSelectedItem={getInit(flexibleStopPlaces, stopPointValue)}
              placeholder={formatMessage('defaultOption')}
              items={mapToItems(flexibleStopPlaces)}
              clearable
              label={formatMessage('stopPlace')}
              onChange={(e) =>
                stopPointChange({
                  ...stopPoint,
                  flexibleStopPlaceRef: e?.value,
                })
              }
              {...getErrorFeedback(
                stopPlaceError ? formatMessage(stopPlaceError) : '',
                !stopPlaceError,
                stopPlacePristine
              )}
            />
          )}

          {selectMode === 'nsr' && (
            <QuayRefField
              initialQuayRef={stopPoint.quayRef}
              errorFeedback={getErrorFeedback(
                stopPlaceError ? formatMessage(stopPlaceError) : '',
                !stopPlaceError,
                quayRefPristine
              )}
              onChange={(quayRef) => stopPointChange({ ...stopPoint, quayRef })}
            />
          )}

          <TextField
            className="stop-point-info-item"
            label={formatMessage(
              isFirstStop ? 'labelFrontTextRequired' : 'labelFrontText'
            )}
            {...getErrorFeedback(
              frontTextError ? formatMessage(frontTextError) : '',
              !frontTextError,
              frontTextPristine
            )}
            disabled={isLastStop}
            labelTooltip={formatMessage('frontTextTooltip')}
            value={frontTextValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              stopPointChange({
                ...stopPoint,
                destinationDisplay: e.target.value
                  ? { frontText: e.target.value }
                  : null,
              })
            }
          />

          <Dropdown
            className="stop-point-info-item"
            label={formatMessage('labelBoarding')}
            initialSelectedItem={convertBoardingToDropdown(stopPoint)}
            placeholder={formatMessage('defaultOption')}
            clearable
            onChange={(element) =>
              stopPointChange({
                ...stopPoint,
                forBoarding: element?.value
                  ? element?.value === '0' || element?.value === '2'
                  : null,
                forAlighting: element?.value
                  ? element?.value === '1' || element?.value === '2'
                  : null,
              })
            }
            items={boardingItems}
            feedback={errors.boarding && formatMessage(errors.boarding)}
            variant={errors.boarding ? 'error' : undefined}
          />
        </div>

        {deleteStopPoint && (
          <DeleteButton
            onClick={() => setDeleteDialogOpen(true)}
            title={formatMessage('editorDeleteButtonText')}
          />
        )}

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
            <SuccessButton key="yes" onClick={deleteStopPoint}>
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
              stopPointChange({
                ...stopPoint,
                bookingArrangement,
              });
            }}
            onRemove={() => {
              stopPointChange({
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

export default StopPointEditor;
