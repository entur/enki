import React from 'react';
import { injectIntl } from 'react-intl';
import { Checkbox, Fieldset, InputGroup, TextField } from '@entur/form';
import StopPlaceSelection from './StopPlaceSelection';
import { quaySearchResults } from './quaySearchResults';
import messages from './Form.messages';
import { isBlank } from 'helpers/forms';

function quaySearchFeedback(errors, searchResults) {
  if (errors.length) {
    return {
      variant: 'error',
      feedback: errors
    };
  }

  return quaySearchResults(searchResults);
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
}) => {
  let frontTextValue =
    stopPoint.destinationDisplay && stopPoint.destinationDisplay.frontText
      ? stopPoint.destinationDisplay.frontText
      : '';

  return (
    <div className="tab-style">
      <StopPlaceSelection
        stopPlaceSelection={stopPlaceSelection}
        flexibleStopPlaceRefAndQuayRefErrors={
          errors.flexibleStopPlaceRefAndQuayRef
        }
        flexibleStopPlaces={flexibleStopPlaces}
        handleStopPlaceSelectionChange={handleStopPlaceSelectionChange}
      />

      <InputGroup
        label={formatMessage(messages.labelQuayRef)}
        {...quaySearchFeedback(errors.quayRef, quaySearch)}
      >
        <TextField
          value={stopPoint.quayRef ?? ''}
          onChange={e => {
            const value = e.target.value;
            handleFieldChange('quayRef', isBlank(value) ? null : value);
            debouncedSearchForQuay();
          }}
        />
      </InputGroup>

      <InputGroup
        label={
          (frontTextRequired ? '* ' : '') +
          formatMessage(messages.labelFrontText)
        }
      >
        <TextField
          value={frontTextValue}
          onChange={e => handleFrontTextChange(e.target.value)}
          variant={errors.frontText.length ? 'error' : undefined}
          feedback={errors.frontText}
        />
      </InputGroup>

      <Fieldset
        label="På og/eller av-stigning"
        className={{ marginTop: '0.5rem' }}
      >
        <Checkbox
          value={'1'}
          checked={stopPoint.forBoarding === true}
          onChange={e => handleFieldChange('forBoarding', e.target.checked)}
        >
          {formatMessage(messages.labelForBoarding)}
        </Checkbox>

        <Checkbox
          value={'1'}
          checked={stopPoint.forAlighting === true}
          onChange={e => handleFieldChange('forAlighting', e.target.checked)}
        >
          {formatMessage(messages.labelForAlighting)}
        </Checkbox>
      </Fieldset>
    </div>
  );
};

export default injectIntl(Form);
