import React, { useState, ChangeEvent, useCallback, useEffect } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { InputGroup, TextField, RadioGroup, Radio } from '@entur/form';
import messages from './Form.messages';
import { FlexibleStopPlace } from 'model';
import { QuaySearch } from './searchForQuay';
import { quaySearchResults } from './quaySearchResults';
import StopPoint from 'model/StopPoint';
import debounce from './debounce';
import { isBlank } from 'helpers/forms';
import searchForQuay from './searchForQuay';
import { Dropdown } from '@entur/dropdown';
import { Paragraph } from '@entur/typography';
import { SecondaryButton, SuccessButton } from '@entur/button';
import { DeleteIcon } from '@entur/icons';
import ConfirmDialog from 'components/ConfirmDialog';
import './styles.scss';

export type StopPointsFormError = {
  flexibleStopPlaceRefAndQuayRef: any;
  frontText: any;
};

interface Props extends WrappedComponentProps {
  index: number;
  flexibleStopPlaces: FlexibleStopPlace[];
  errors: StopPointsFormError;
  onChange: (stopPoint: StopPoint) => void;
  stopPoint: StopPoint;
  frontTextRequired: boolean;
  deleteStopPoint?: () => void;
}

const StopPointEditor = ({
  index,
  flexibleStopPlaces,
  intl: { formatMessage },
  errors,
  onChange,
  stopPoint,
  frontTextRequired,
  deleteStopPoint
}: Props) => {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectMode, setSelectMode] = useState<'nsr' | 'custom'>(
    stopPoint.quayRef ? 'nsr' : 'custom'
  );
  const [quaySearch, setQuaySearch] = useState<QuaySearch | undefined>(
    undefined
  );

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
          name="stopPointMode"
          value={selectMode}
          onChange={e => console.log(e.target.value)}
        >
          <Radio value="custom">{formatMessage(messages.selectCustom)}</Radio>
          <Radio value="nsr">{formatMessage(messages.selectNSR)}</Radio>
        </RadioGroup>
      </div>
      <div className="stop-point-info">
        {selectMode === 'custom' && (
          <Dropdown
            label={formatMessage(messages.stopPlace)}
            value={
              stopPoint.flexibleStopPlaceRef ?? stopPoint.flexibleStopPlace?.id
            }
            items={flexibleStopPlaces.map(fsp => ({
              value: fsp.id,
              label: fsp.name ?? ''
            }))}
            onChange={e =>
              onChange({
                ...stopPoint,
                flexibleStopPlaceRef: e?.value,
                quayRef: undefined
              })
            }
            variant={stopPlaceError ? 'error' : undefined}
            feedback={
              stopPlaceError ? formatMessage(stopPlaceError) : undefined
            }
          />
        )}

        {selectMode === 'nsr' && (
          <InputGroup
            label={formatMessage(messages.labelQuayRef)}
            feedback={
              stopPlaceError ? formatMessage(stopPlaceError) : undefined
            }
            variant={stopPlaceError ? 'error' : undefined}
            {...quaySearchResults(quaySearch)}
          >
            <TextField
              defaultValue={stopPoint.quayRef ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                debouncedSearchForQuay(e.target.value)
              }
              onBlur={(e: ChangeEvent<HTMLInputElement>) =>
                onChange({
                  ...stopPoint,
                  quayRef: e.target.value,
                  flexibleStopPlaceRef: undefined
                })
              }
            />
          </InputGroup>
        )}

        <InputGroup
          label={`${frontTextRequired ? '* ' : ''}${formatMessage(
            messages.labelFrontText
          )}`}
          variant={frontTextError ? 'error' : undefined}
          feedback={frontTextError ? formatMessage(frontTextError) : undefined}
        >
          <TextField
            defaultValue={stopPoint.destinationDisplay?.frontText ?? ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange({
                ...stopPoint,
                destinationDisplay: { frontText: e.target.value }
              })
            }
          />
        </InputGroup>
        <Dropdown
          label={formatMessage(messages.labelBoarding)}
          value={convertBoardingToDropdown(stopPoint)}
          onChange={value =>
            onChange({
              ...stopPoint,
              forBoarding: value?.value === '0' || value?.value === '2',
              forAlighting: value?.value === '1' || value?.value === '2'
            })
          }
          items={[
            { value: '0', label: formatMessage(messages.labelForBoarding) },
            { value: '1', label: formatMessage(messages.labelForAlighting) },
            { value: '2', label: formatMessage(messages.labelForBoth) }
          ]}
        />
      </div>
      {deleteStopPoint && (
        <SecondaryButton
          className="delete-button"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <DeleteIcon inline /> {formatMessage(messages.delete)}
        </SecondaryButton>
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title={formatMessage(messages.stopPointDeleteTitle)}
        message={formatMessage(messages.stopPointDeleteMessage)}
        buttons={[
          <SecondaryButton onClick={() => setDeleteDialogOpen(false)}>
            {formatMessage(messages.no)}
          </SecondaryButton>,
          <SuccessButton onClick={deleteStopPoint}>
            {formatMessage(messages.yes)}
          </SuccessButton>
        ]}
        onDismiss={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default injectIntl(StopPointEditor);
