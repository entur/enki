import React, { useState, ChangeEvent } from 'react';
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
import { DEFAULT_SELECT_VALUE } from './constants';

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
  const [selectMode, setSelectMode] = useState<string | null>('custom');

  const changeSelectMode = (selectedMode: string | null) => {
    if (selectedMode === 'custom') {
      handleFieldChange('quayRef', null);
      setSelectMode('custom');
    } else if (selectedMode === 'nsr') {
      handleStopPlaceSelectionChange(DEFAULT_SELECT_VALUE);
      setSelectMode('nsr');
    }
  };

  return (
    <div className="tab-style">
      <div style={{ marginBottom: '1rem' }}>
        <SegmentedControl
          onChange={selectedValue => changeSelectMode(selectedValue)}
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
            value={stopPoint.quayRef ?? ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              handleFieldChange('quayRef', isBlank(value) ? null : value);
              debouncedSearchForQuay(value);
            }}
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
