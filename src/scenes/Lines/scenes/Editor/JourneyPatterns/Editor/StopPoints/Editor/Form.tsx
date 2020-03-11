import React, { useState, ChangeEvent, useEffect } from 'react';
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
import { QuaySearchResults, quaySearchResults } from './quaySearchResults';
import messages from './Form.messages';
import { isBlank } from 'helpers/forms';
import { StopPoint, FlexibleStopPlace } from 'model';
import { StopPlaceSelectionType } from './index';
import { QuaySearch } from './searchForQuay';

function quaySearchFeedback(
  errors: string[],
  searchResults: QuaySearch | undefined
): QuaySearchResults {
  if (errors.length) {
    return {
      variant: 'error',
      feedback: errors.join(';')
    };
  }

  return quaySearchResults(searchResults);
}

interface Props extends WrappedComponentProps {
  flexibleStopPlaces: FlexibleStopPlace[];
  stopPlaceSelection: StopPlaceSelectionType;
  quaySearch: QuaySearch | undefined;
  errors: {
    quayRef: any[];
    flexibleStopPlaceRefAndQuayRef: any[];
    frontText: any[];
  };
  handleStopPlaceSelectionChange: (
    stopPlaceSelection: StopPlaceSelectionType
  ) => void;
  handleFieldChange: (field: string, value: any) => void;
  debouncedSearchForQuay: (quayRef: string) => void;
  handleFrontTextChange: (frontText: string) => void;
  stopPoint: StopPoint;
  frontTextRequired: boolean;
}

const Form = ({
  flexibleStopPlaces,
  intl: { formatMessage },
  stopPlaceSelection,
  quaySearch,
  errors,
  handleStopPlaceSelectionChange,
  handleFieldChange,
  debouncedSearchForQuay,
  handleFrontTextChange,
  stopPoint,
  frontTextRequired
}: Props) => {
  let frontTextValue =
    stopPoint.destinationDisplay && stopPoint.destinationDisplay.frontText
      ? stopPoint.destinationDisplay.frontText
      : '';
  const [selectMode, setSelectMode] = useState<string | null>(
    stopPoint.quayRef ? 'nsr' : 'custom'
  );

  useEffect(() => {
    if (selectMode === 'custom') {
      handleFieldChange('quayRef', null);
      setSelectMode('custom');
    } else if (selectMode === 'nsr') {
      handleStopPlaceSelectionChange(null);
      setSelectMode('nsr');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectMode]);

  return (
    <div className="tab-style">
      <div style={{ marginBottom: '1rem' }}>
        <SegmentedControl
          onChange={selectedValue => setSelectMode(selectedValue)}
          selectedValue={selectMode}
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
          stopPlaceSelection={stopPlaceSelection}
          flexibleStopPlaceRefAndQuayRefErrors={
            errors.flexibleStopPlaceRefAndQuayRef
          }
          flexibleStopPlaces={flexibleStopPlaces}
          handleStopPlaceSelectionChange={handleStopPlaceSelectionChange}
        />
      ) : (
        <InputGroup
          label={formatMessage(messages.labelQuayRef)}
          {...quaySearchFeedback(errors.quayRef, quaySearch)}
        >
          <TextField
            defaultValue={stopPoint.quayRef ?? ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              debouncedSearchForQuay(e.target.value)
            }
            onBlur={(e: ChangeEvent<HTMLInputElement>) =>
              handleFieldChange(
                'quayRef',
                isBlank(e.target.value) ? null : e.target.value
              )
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
          value={frontTextValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleFrontTextChange(e.target.value)
          }
          variant={errors.frontText.length ? 'error' : undefined}
          feedback={errors.frontText}
        />
      </InputGroup>

      <Fieldset label="På og/eller av-stigning" style={{ marginTop: '0.5rem' }}>
        <Checkbox
          value={'1'}
          checked={stopPoint.forBoarding === true}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleFieldChange('forBoarding', e.target.checked)
          }
        >
          {formatMessage(messages.labelForBoarding)}
        </Checkbox>

        <Checkbox
          value={'1'}
          checked={stopPoint.forAlighting === true}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleFieldChange('forAlighting', e.target.checked)
          }
        >
          {formatMessage(messages.labelForAlighting)}
        </Checkbox>
      </Fieldset>
    </div>
  );
};

export default injectIntl(Form);
