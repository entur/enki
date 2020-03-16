import React, { useState, ChangeEvent, useCallback, useEffect } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import {
  Checkbox,
  Fieldset,
  InputGroup,
  TextField,
  SegmentedControl,
  SegmentedChoice
} from '@entur/form';
import StopPlaceSelection from './StopPlaceSelection';
import messages from './Form.messages';
import { FlexibleStopPlace } from 'model';
import { StopPointsFormError } from './index';
import { QuaySearch } from './searchForQuay';
import { quaySearchResults } from './quaySearchResults';
import StopPoint from 'model/StopPoint';
import debounce from 'scenes/Lines/scenes/Editor/JourneyPatterns/Editor/StopPoints/Editor/debounce';
import { isBlank } from 'helpers/forms';
import searchForQuay from 'scenes/Lines/scenes/Editor/JourneyPatterns/Editor/StopPoints/Editor/searchForQuay';

interface Props extends WrappedComponentProps {
  flexibleStopPlaces: FlexibleStopPlace[];
  errors: StopPointsFormError;
  onChange: (stopPoint: StopPoint) => void;
  stopPoint: StopPoint;
  frontTextRequired: boolean;
}

const Form = ({
  flexibleStopPlaces,
  intl: { formatMessage },
  errors,
  onChange,
  stopPoint,
  frontTextRequired
}: Props) => {
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

  return (
    <div className="tab-style">
      <div style={{ marginBottom: '1rem' }}>
        <SegmentedControl
          selectedValue={selectMode}
          onChange={value => setSelectMode(value as 'nsr' | 'custom')}
        >
          <SegmentedChoice value="custom">
            {formatMessage(messages.selectCustom)}
          </SegmentedChoice>
          <SegmentedChoice value="nsr">
            {formatMessage(messages.selectNSR)}
          </SegmentedChoice>
        </SegmentedControl>
      </div>

      {selectMode === 'custom' ? (
        <StopPlaceSelection
          stopPlaceSelection={
            stopPoint.flexibleStopPlaceRef ?? stopPoint.flexibleStopPlace?.id
          }
          error={errors.flexibleStopPlaceRefAndQuayRef}
          flexibleStopPlaces={flexibleStopPlaces}
          handleStopPlaceSelectionChange={(stopPlaceRef: string) =>
            onChange({
              ...stopPoint,
              flexibleStopPlaceRef: stopPlaceRef,
              quayRef: undefined
            })
          }
        />
      ) : (
        <InputGroup
          label={formatMessage(messages.labelQuayRef)}
          feedback={
            errors.flexibleStopPlaceRefAndQuayRef
              ? formatMessage(errors.flexibleStopPlaceRefAndQuayRef)
              : undefined
          }
          variant={errors.flexibleStopPlaceRefAndQuayRef ? 'error' : undefined}
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
        label={
          (frontTextRequired ? '* ' : '') +
          formatMessage(messages.labelFrontText)
        }
      >
        <TextField
          defaultValue={stopPoint.destinationDisplay?.frontText ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange({
              ...stopPoint,
              destinationDisplay: { frontText: e.target.value }
            })
          }
          variant={errors.frontText ? 'error' : undefined}
          feedback={
            errors.frontText ? formatMessage(errors.frontText) : undefined
          }
        />
      </InputGroup>

      <Fieldset label="På og/eller av-stigning" style={{ marginTop: '0.5rem' }}>
        <Checkbox
          value={'1'}
          checked={stopPoint.forBoarding === true}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange({ ...stopPoint, forBoarding: e.target.checked })
          }
        >
          {formatMessage(messages.labelForBoarding)}
        </Checkbox>

        <Checkbox
          value={'1'}
          checked={stopPoint.forAlighting === true}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange({ ...stopPoint, forAlighting: e.target.checked })
          }
        >
          {formatMessage(messages.labelForAlighting)}
        </Checkbox>
      </Fieldset>
    </div>
  );
};

export default injectIntl(Form);
