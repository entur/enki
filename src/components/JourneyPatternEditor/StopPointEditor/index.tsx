import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { InputGroup, Radio, RadioGroup, TextField } from '@entur/form';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import searchForQuay, { QuaySearch } from './searchForQuay';
import { quaySearchResults } from './quaySearchResults';
import StopPoint from 'model/StopPoint';
import debounce from './debounce';
import { isBlank } from 'helpers/forms';
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
import { MessagesKey } from 'i18n/translations/translationKeys';
import { getInit, mapToItems } from 'helpers/dropdown';
import { NormalizedDropdownItemType } from '@entur/dropdown/dist/useNormalizedItems';
import './styles.scss';

type StopPlaceMode = 'nsr' | 'custom';

export type StopPointsFormError = {
  flexibleStopPlaceRefAndQuayRef: keyof MessagesKey | undefined;
  frontText: keyof MessagesKey | undefined;
  boarding: keyof MessagesKey | undefined;
};

type Props = {
  index: number;
  flexibleStopPlaces: FlexibleStopPlace[];
  errors: StopPointsFormError;
  stopPointChange: (stopPoint: StopPoint) => void;
  stopPoint: StopPoint;
  isFirstStop: boolean;
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
  deleteStopPoint,
  spoilPristine,
  flexibleLineType,
}: Props) => {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectMode, setSelectMode] = useState<StopPlaceMode>(
    stopPoint.quayRef || !flexibleLineType ? 'nsr' : 'custom'
  );
  const [quaySearch, setQuaySearch] = useState<QuaySearch | undefined>(
    undefined
  );

  const { formatMessage } = useSelector<GlobalState, AppIntlState>(selectIntl);

  const stopPointValue = stopPoint.flexibleStopPlaceRef;
  const frontTextValue = stopPoint.destinationDisplay?.frontText;

  const stopPlacePristine = usePristine(stopPointValue, spoilPristine);
  const quayRefPristine = usePristine(stopPoint.quayRef, spoilPristine);
  const frontTextPristine = usePristine(frontTextValue, spoilPristine);

  useEffect(() => {
    const quayRef = stopPoint.quayRef;
    if (quayRef) {
      const search = async () => {
        const result = await searchForQuay(quayRef);
        setQuaySearch(result);
      };
      search();
    }
    // eslint-disable-next-line
  }, []);

  const debouncedSearchForQuay = useCallback(
    debounce(async (quayRef: string) => {
      if (isBlank(quayRef)) return setQuaySearch({});
      setQuaySearch(await searchForQuay(quayRef));
    }, 1000),
    []
  );

  const stopPlaceError = errors.flexibleStopPlaceRefAndQuayRef;
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
    <div className="stop-point-element">
      <div className="stop-point-key-info">
        <Paragraph>{index + 1}</Paragraph>
        {flexibleLineType && (
          <RadioGroup
            name={`stopPointMode-${index}`}
            value={selectMode}
            onChange={(e) => {
              setSelectMode(e.target.value as StopPlaceMode);
              setQuaySearch(undefined);
              stopPointChange({
                ...stopPoint,
                quayRef: undefined,
                flexibleStopPlaceRef: undefined,
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
              stopPointChange({ ...stopPoint, flexibleStopPlaceRef: e?.value })
            }
            {...getErrorFeedback(
              stopPlaceError ? formatMessage(stopPlaceError) : '',
              !stopPlaceError,
              stopPlacePristine
            )}
          />
        )}

        {selectMode === 'nsr' && (
          <InputGroup
            className="nsr-input-group"
            label={formatMessage('labelQuayRef')}
            {...getErrorFeedback(
              stopPlaceError ? formatMessage(stopPlaceError) : '',
              !stopPlaceError,
              quayRefPristine
            )}
            {...quaySearchResults(quaySearch)}
          >
            <TextField
              defaultValue={stopPoint.quayRef}
              placeholder="NSR:Quay:69"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                debouncedSearchForQuay(e.target.value)
              }
              onBlur={(e: ChangeEvent<HTMLInputElement>) =>
                stopPointChange({ ...stopPoint, quayRef: e.target.value })
              }
            />
          </InputGroup>
        )}

        <InputGroup
          label={formatMessage(
            isFirstStop ? 'labelFrontTextRequired' : 'labelFrontText'
          )}
          {...getErrorFeedback(
            frontTextError ? formatMessage(frontTextError) : '',
            !frontTextError,
            frontTextPristine
          )}
          labelTooltip={formatMessage('frontTextTooltip')}
        >
          <TextField
            defaultValue={frontTextValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              stopPointChange({
                ...stopPoint,
                destinationDisplay: { frontText: e.target.value },
              })
            }
          />
        </InputGroup>
        <Dropdown
          className="stop-point-dropdown"
          label={formatMessage('labelBoarding')}
          initialSelectedItem={convertBoardingToDropdown(stopPoint)}
          placeholder={formatMessage('defaultOption')}
          clearable
          onChange={(element) =>
            stopPointChange({
              ...stopPoint,
              forBoarding: element?.value === '0' || element?.value === '2',
              forAlighting: element?.value === '1' || element?.value === '2',
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
        title={formatMessage('deleteTitle')}
        message={formatMessage('deleteMessage')}
        buttons={[
          <SecondaryButton key="no" onClick={() => setDeleteDialogOpen(false)}>
            {formatMessage('no')}
          </SecondaryButton>,
          <SuccessButton key="yes" onClick={deleteStopPoint}>
            {formatMessage('yes')}
          </SuccessButton>,
        ]}
        onDismiss={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default StopPointEditor;
