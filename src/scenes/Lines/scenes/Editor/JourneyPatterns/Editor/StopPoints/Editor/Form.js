import React, { Fragment } from 'react';
import {injectIntl} from 'react-intl';
import Errors from '../../../../Errors';
import {Checkbox, Label, TextField} from '@entur/component-library';
import {hasValue} from '../../../../helpers';
import StopPlaceSelection from './StopPlaceSelection';
import QuaySearchResults from './QuaySearchResults';
import messages from './Form.messages';

const Form = ({
  flexibleStopPlaces,
  intl: {formatMessage},
  stopPlaceSelection,
  quaySearch,
  errors,
  handleStopPlaceSelectionChange,
  handleFieldChange,
  debouncedSearchForQuay,
  handleFrontTextChange,
  stopPoint
}) => {
  let frontTextValue = stopPoint.destinationDisplay &&
    stopPoint.destinationDisplay.frontText
      ? stopPoint.destinationDisplay.frontText
      : '';

  return (
    <Fragment>
      <Errors errors={errors.flexibleStopPlaceRefAndQuayRef} />

      <StopPlaceSelection
        stopPlaceSelection={stopPlaceSelection}
        flexibleStopPlaceRefAndQuayRefErrors={errors.flexibleStopPlaceRefAndQuayRef}
        flexibleStopPlaces={flexibleStopPlaces}
        handleStopPlaceSelectionChange={handleStopPlaceSelectionChange}
      />

      <Label>{formatMessage(messages.labelQuayRef)}</Label>
      <TextField
        type="text"
        value={stopPoint.quayRef || ''}
        onChange={e => {
          let value = e.target.value;
          handleFieldChange('quayRef', hasValue(value) ? value : null);
          debouncedSearchForQuay();
        }
        }
        className={(errors.quayRef.length > 0 || errors.flexibleStopPlaceRefAndQuayRef.length > 0) ? 'input-error' : ''}
      />

      <QuaySearchResults quaySearch={quaySearch}/>

      <Errors errors={errors.quayRef} />

      <Label>* {formatMessage(messages.labelFrontText)}</Label>
      <TextField
        type="text"
        value={frontTextValue}
        onChange={e => handleFrontTextChange(e.target.value)}
        className={errors.frontText.length > 0 ? 'input-error' : ''}
      />

      <Errors errors={errors.frontText} />

      <div style={{marginBottom: '1em'}}>
        <Checkbox
          value={'1'}
          checked={stopPoint.forBoarding === true}
          onChange={e =>
            handleFieldChange('forBoarding', e.target.checked)
          }
          label={formatMessage(messages.labelForBoarding)}
        />
      </div>

      <Checkbox
        value={'1'}
        checked={stopPoint.forAlighting === true}
        onChange={e =>
          handleFieldChange('forAlighting', e.target.checked)
        }
        label={formatMessage(messages.labelForAlighting)}
      />
    </Fragment>
  );
};

export default injectIntl(Form);
