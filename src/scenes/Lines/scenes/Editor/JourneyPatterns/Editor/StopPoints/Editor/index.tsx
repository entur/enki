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
import { DeleteIcon } from '@entur/icons';
import ConfirmDialog from 'components/ConfirmDialog';
import './styles.scss';
import { usePristine } from 'scenes/Lines/scenes/Editor/hooks';
import { getErrorFeedback } from 'helpers/errorHandling';
import { AppIntlState, selectIntl } from 'i18n';
import { useSelector } from 'react-redux';
import { GlobalState } from 'reducers';

type StopPlaceMode = 'nsr' | 'custom';

export type StopPointsFormError = {
  flexibleStopPlaceRefAndQuayRef: any;
  frontText: any;
  boarding: any;
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
}: Props) => {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectMode, setSelectMode] = useState<StopPlaceMode>(
    stopPoint.quayRef ? 'nsr' : 'custom'
  );
  const [quaySearch, setQuaySearch] = useState<QuaySearch | undefined>(
    undefined
  );

  const { formatMessage } = useSelector<GlobalState, AppIntlState>(selectIntl);

  const stopPointValue =
    stopPoint.flexibleStopPlaceRef ?? stopPoint.flexibleStopPlace?.id;
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

      const quaySearch = await searchForQuay(quayRef);
      setQuaySearch(quaySearch);
    }, 1000),
    []
  );

  const stopPlaceError = errors.flexibleStopPlaceRefAndQuayRef;
  const frontTextError = errors.frontText;

  const convertBoardingToDropdown = (
    sp: StopPoint
  ): '0' | '1' | '2' | undefined => {
    if (sp.forBoarding && sp.forAlighting) return '2';
    else if (sp.forBoarding) return '0';
    else if (sp.forAlighting) return '1';
    else return undefined;
  };

  return (
    <div className="stop-point-element">
      <div className="stop-point-key-info">
        <Paragraph>{index + 1}</Paragraph>
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
      </div>
      <div className="stop-point-info">
        {selectMode === 'custom' && (
          <Dropdown
            label={formatMessage('stopPlace')}
            value={stopPointValue}
            items={flexibleStopPlaces.map((fsp) => ({
              value: fsp.id,
              label: fsp.name ?? '',
            }))}
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
          label={`${formatMessage('labelFrontText')}${isFirstStop ? ' *' : ''}`}
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
          label={formatMessage('labelBoarding')}
          value={convertBoardingToDropdown(stopPoint)}
          onChange={(element) =>
            stopPointChange({
              ...stopPoint,
              forBoarding: element?.value === '0' || element?.value === '2',
              forAlighting: element?.value === '1' || element?.value === '2',
            })
          }
          items={[
            { value: '0', label: formatMessage('labelForBoarding') },
            { value: '1', label: formatMessage('labelForAlighting') },
            {
              value: '2',
              label: formatMessage('labelForBoardingAndAlighting'),
            },
          ]}
          feedback={errors.boarding && formatMessage(errors.boarding)}
          variant={errors.boarding ? 'error' : undefined}
        />
      </div>
      {deleteStopPoint && (
        <SecondaryButton
          className="delete-button"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <DeleteIcon inline /> {formatMessage('editorDeleteButtonText')}
        </SecondaryButton>
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title={formatMessage('deleteTitle')}
        message={formatMessage('deleteMessage')}
        buttons={[
          <SecondaryButton key="no" onClick={() => setDeleteDialogOpen(false)}>
            {formatMessage('tableNo')}
          </SecondaryButton>,
          <SuccessButton key="yes" onClick={deleteStopPoint}>
            {formatMessage('tableYes')}
          </SuccessButton>,
        ]}
        onDismiss={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default StopPointEditor;
